import { ethogram } from "./ethogram_generator.js"
import { frequentietabel } from "./frequentietabel_generator.js"
import { sequentietabel } from "./sequentietabel_generator.js"
import popup from "./popup.js"

function downloadZip (zip, naam) {
  zip.generateAsync({ type: 'blob' })
    .then(function (blob) {
      saveAs(blob, naam + '.zip')
    })
}

const timer = ms => new Promise(res => setTimeout(res, ms))

async function create (type) {
  popup.popupText('Bestanden Openen')
  popup.openPopup()
  const files = document.querySelector('#file').files
  if (files.length < 0) {
    alert('Selecteer één of meerdere bestanden')
    popup.closePopup()
    return
  }
  let zip; let zipNaam = 'resultaten'
  if (files.length > 1 || type == 'all') {
    zip = new JSZip()
    if (type == 'all' && files.length > 1) {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        popup.popupText(`Frequentietabel genereren - ${index + 1}/${files.length}`)
        const frequentieTabel = await frequentietabel(file)
        popup.popupText(`Sequentietabel genereren - ${index + 1}/${files.length}`)
        const sequentieTabel = await sequentietabel(file)
        console.log(sequentieTabel)
        zip.folder(file.name).file('frequentietabel.csv', frequentieTabel)
        zip.folder(file.name).file('sequentietabel.csv', sequentieTabel)
      }
      popup.popupText('Ethogram genereren')
      zip.file('ethogram.csv', ethogram(files))
    } else if (files.length == 1 && type == 'all') {
      const file = files[0]
      popup.popupText('Frequentietabel genereren')
      zip.file('frequentietabel.csv', await frequentietabel(file))
      popup.popupText('Sequentietabel genereren')
      zip.file('sequentietabel.csv', await sequentietabel(file))
      popup.popupText('Ethogram genereren')
      zip.file('ethogram.csv', ethogram(files))
      zipNaam = file.name
    } else if (type == 'f') {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        popup.popupText(`Frequentietabel genereren - ${index + 1}/${files.length}`)
        zip.file(file.name + '.csv', await frequentietabel(file))
      }
      zipNaam = 'frequentietabellen'
    } else if (type == 's') {
      for (let index = 0; index < files.length; index++) {
        const file = files[index]
        popup.popupText(`Sequentietabel genereren - ${index + 1}/${files.length}`)
        zip.file(file.name + '.csv', await sequentietabel(file))
      }
      zipNaam = 'sequentietabellen'
    }
    if (type == 'e') {
      popup.popupText('Ethogram genereren')
      ethogram(files, true)
    } else {
      popup.popupText('Bestanden inpakken')
      downloadZip(zip, zipNaam)
    }
    popup.popupText('Download beschikbaar')
    await timer(1000)
    popup.closePopup()
  } else {
    if (type == 's') {
      popup.popupText('Sequentietabel genereren')
      sequentietabel(files[0], true)
      popup.popupText('Download beschikbaar')
      await timer(1000)
      popup.closePopup()
    } else if (type == 'f') {
      popup.popupText('Frequentietabel genereren')
      frequentietabel(files[0], true)
      popup.popupText('Download beschikbaar')
      await timer(1000)
      popup.closePopup()
    } else if (type == 'e') {
      popup.popupText('Ethogram genereren')
      ethogram(files, true)
      popup.popupText('Download beschikbaar')
      await timer(1000)
      popup.closePopup()
    }
  }
}

document.getElementById('btnsubmitfreq').addEventListener("click", () => {create("f")})
document.getElementById('btnsubmitseq').addEventListener("click", () => {create("s")})
document.getElementById('btnsubmiteth').addEventListener("click", () => {create("e")})
document.getElementById('btnsubmitall').addEventListener("click", () => {create("all")})

export default {create}