async function processFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (event) {
      const csvdata = event.target.result
      const rowData = csvdata.split('\n')
      const gedragRaw = parse_result(rowData, false)

      const elementen = []

      for (const row of gedragRaw[0]) {
        for (let x of row) {
          x = x.trim()
          if (elementen.indexOf(x) === -1) {
            elementen.push(x)
          }
        }
      }

      resolve(elementen)
    }
  })
}

async function ethogram(files, only = false) {
  const elementen = []

  for (const file of files) {
    const fileElementen = await processFile(file)
    for (let x of fileElementen) {
      x = x.trim()
      if (elementen.indexOf(x) === -1) {
        elementen.push(x)
      }
    }

    console.log('elementen')
    console.log(elementen)

    const ethogram = [['Afkorting', 'Gedrag', 'Beschrijving']]
    for (let index = 0; index < elementen.length; index++) {
      const element = elementen[index]
      ethogram.push([element, '', ''])
    }

    console.log('ethogram')
    console.table(ethogram)

    let csvContent = ''

    ethogram.forEach(function (rowArray) {
      const row = rowArray.join(',')
      csvContent += row + '\r\n'
    })

    if (only) {
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'ethogram.csv')
      document.body.appendChild(link) // Nodig voor Firefox.

      link.click() // Hiermee wordt het gegevensbestand gedownload met de naam "sequentietabel.csv".
    } else {
      console.log('return')
      return csvContent
    }
  }
}
