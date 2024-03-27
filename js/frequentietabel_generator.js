import color_changer from "./color_changer"
import parse_result from "./parse_data"
import createTable from "./create_table"

// Functie om de frequentietabel te genereren.
function frequentietabel (file, only = false) {
  return new Promise((resolve, reject) => {
    // Pak de waarde van de checkbox 'animatie' en het geselecteerde bestand en interval.
    const animatie = document.getElementById('animatie').checked
    let interval = document.querySelector('#frequentie').value
    interval = Number(interval)
    const csvRows = []

    // Pak de 'div' met de id 'table' en maak deze leeg.
    const content = document.getElementById('table')
    if (animatie) { content.textContent = `${file.name} - Frequentietabel` } else { content.textContent = '' }

    // Controleer of de variabelen (het bestand en het interval) geldig zijn.
    try {
      if (interval <= 0) throw 'Geef een (geldig) interval.'
    } catch (error) {
      var err = error
    }

    // Als zowel het bestand als het interval geldig zijn:
    if (interval >= 0) {
      // Open de FileReader.
      const reader = new FileReader()

      // Lees het bestand.
      reader.readAsText(file)

      // Load event, start deze functie zodra het bestand geladen is.
      reader.onload = function (event) {
        // Lees de inhoud van het CSV-bestand.
        const csvdata = event.target.result

        // Split de lijnen in rijen.
        const rowData = csvdata.split('\n')

        // Voorbereiden van de arrays die later ingevuld worden met data.
        const tijden = []; var gedrag = []; var visueel = []

        // Lees de informatie uit het bestand en zet deze in de variabelen: visueel met tijden, gedragRaw zonder tijden.
        var visueel = parse_result(rowData, true)
        const gedragRaw = parse_result(rowData, false)

        // Zet de gegevens om in beter leesbare tabellen.
        var gedrag = gedragRaw[0]
        const alleTijden = gedragRaw[1]

        // Maak een tabel voor de visuele weergave van de gegevens met tijden en een id van 'protocol en toon deze.
        if (animatie) createTable(visueel, 'protocol')

        // Verzamel de tijden voor de headers van de tijdsintervallen.
        for (i = 0; i < alleTijden.length; i += interval) {
          if (i + interval - 1 < alleTijden.length) {
            tijden.push(alleTijden[i] + '-' + alleTijden[i + interval - 1])
          } else {
            const over = alleTijden.length % interval
            if (over <= 1) {
              tijden.push(alleTijden[i])
            } else {
              tijden.push(alleTijden[i] + '-' + alleTijden[i + over - 1])
            }
          }
        }

        const elementen = []

        // Zet een timer op basis van het aantal miliseconden dat gegeven is.
        const timer = ms => new Promise(res => setTimeout(res, ms))

        async function load () { // Deze functie moet een async functie zijn, zodat de timer correct werkt.
          for (const row of gedrag) {
            for (const x of row) {
              try {
                if ((elementen.indexOf(x)) == -1) throw 'not in list'
              } catch (err) {
                if (err = 'not in list') {
                  elementen.push(x)
                  if (animatie) {
                    color_changer.changeBackgroundColor(color_changer.getColor(elementen.indexOf(x)), 'protocol-' + gedrag.indexOf(row) + '-' + (row.indexOf(x) + 1))
                    await timer(250)
                  }
                }
              }
            }
          }

          if (animatie) {
            await timer(2000)

            for (const row of gedrag) {
              for (const x of row) {
                color_changer.changeBackgroundColor(color_changer.getColor(-1), 'protocol-' + gedrag.indexOf(row) + '-' + (row.indexOf(x) + 1))
              }
            }
          }

          var tabel = []
          let nietGeteldetabel = []

          // Verzamel alle gedragselementen binnen een interval.
          for (i = 0; i < (gedrag.length); i += interval) {
            const elementenInterval = []
            for (j = 0; j < interval; j++) {
              elementenInterval.push(gedrag[i + j])
            }
            nietGeteldetabel.push(elementenInterval)
          }

          const visueelNietGeteldeTabel = []
          for (const row of nietGeteldetabel) {
            const newRow = []
            for (const column of row) {
              try {
                for (const item of column) {
                  newRow.push(item)
                } throw 'column empty'
              } catch (error) {
                if (!error == 'column empty') {
                  alert(error)
                }
              }
            }
            visueelNietGeteldeTabel.push(newRow)
          }

          nietGeteldetabel = []
          for (const row of visueelNietGeteldeTabel) {
            nietGeteldetabel.push(row)
          }

          if (animatie) content.textContent = `${file.name} - Sequentietabel`

          console.table(visueelNietGeteldeTabel)
          console.table(nietGeteldetabel)

          for (const tijd of tijden) {
            const index = tijden.indexOf(tijd)
            visueelNietGeteldeTabel[index].unshift(tijd)
          }

          if (animatie) createTable(visueelNietGeteldeTabel, 'teltabel')

          var tabel = []; const elemtenRow = []
          for (const element of elementen) {
            elemtenRow.push(element)
          }
          tabel.push(elemtenRow)

          // Tel de elementen binnen hun frequentie.
          for (rij of nietGeteldetabel) {
            const elementenRow = []
            for (i = 0; i < elementen.length; i++) {
              elementenRow[i] = 0
            }
            tabel.push(elementenRow)
          }

          // Voeg de tijden toe aan de tabel
          for (const tijd of tijden) {
            const index = tijden.indexOf(tijd)
            tabel[index + 1].unshift(tijd)
          }

          tabel[0].unshift('')

          if (animatie) createTable(tabel, 'frequentie')

          // Vul de frequentietabel in
          for (const rij of nietGeteldetabel) {
            for (i = 1; i < rij.length; i++) {
              // Voor ieder element, voeg 1 toe aan het element in de tabel, op basis van zijn index en zet dit vervolgens in de tabel op de html pagina. Verander vervolgens ook de achtergrond kleur van de element.
              try {
                const element = rij[i]
                if (elementen.indexOf(element) >= 0) {
                  tabel[nietGeteldetabel.indexOf(rij) + 1][elementen.indexOf(element) + 1]++

                  if (animatie) {
                    color_changer.changeBackgroundColor(color_changer.getColor(elementen.indexOf(element)), 'frequentie-' + (nietGeteldetabel.indexOf(rij) + 1) + '-' + (elementen.indexOf(element) + 1))
                    document.getElementById('frequentie-' + (nietGeteldetabel.indexOf(rij) + 1) + '-' + (elementen.indexOf(element) + 1)).textContent = tabel[nietGeteldetabel.indexOf(rij) + 1][elementen.indexOf(element) + 1]

                    color_changer.changeBackgroundColor(color_changer.getColor(elementen.indexOf(element)), 'teltabel-' + nietGeteldetabel.indexOf(rij) + '-' + (i))
                    await timer(100)
                    color_changer.changeBackgroundColor(color_changer.getColor(-1), 'frequentie-' + (nietGeteldetabel.indexOf(rij) + 1) + '-' + (elementen.indexOf(element) + 1))
                  }
                } throw 'empty'
              } catch (error) {
                if (!error == 'empty') {
                  alert(error)
                }
              }
            }
          }

          // Maak het downloadbare csv-bestand aan voor de sequentietabel.
          tabel.forEach(function (rowArray) {
            const row = rowArray.join(',')
            csvRows.push(row)
          })

          const csvContent = csvRows.join('\r\n')

          if (only) {
            const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent)
            const link = document.createElement('a')
            link.setAttribute('href', encodedUri)
            link.setAttribute('download', 'frequentietabel.csv')
            document.body.appendChild(link)

            link.click()
            resolve() // Resolve the promise
          } else {
            resolve(csvContent) // Resolve the promise with csvContent
          }
        }

        load()
      }

      reader.onerror = function (event) {
        reject(event.error) // Reject the promise in case of an error
      }
    } else {
      alert(err)
    }
  })
}


export default { frequentietabel }
export { frequentietabel }