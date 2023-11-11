// Functie om een sequentietabel te genereren.
function sequentietabel (file, only = false) {
  return new Promise((resolve, reject) => {
    const content = document.getElementById('table')
    const animatie = document.getElementById('animatie').checked

    if (animatie) { content.textContent = `${file.name} - Sequentietabel` } else { content.textContent = '' }
    const csvRows = []

    // FileReader Object
    const reader = new FileReader()

    // Lees het bestand als een tekstbestand.
    reader.readAsText(file)

    // Laad event
    reader.onload = function (event) {
      // Lees de gegevens van het bestand.
      const csvdata = event.target.result

      // Split de data in regels om een array van rijen te krijgen.
      const rowData = csvdata.split('\n')

      // Voorbereiden van de arrays om de gegevens te verwerken.
      const tijden = []; var gedrag = []; var visueel = []

      // Lees de informatie uit het bestand en zet deze in de variabelen: visueel met tijden, gedragRaw zonder tijden.
      var visueel = parse_result(rowData, true)
      const gedragRaw = parse_result(rowData, false)

      // Zet de gegevens om in een leesbare tabel voor visuele weergave ('protocol') en toon deze.
      var gedrag = gedragRaw[0]
      if (animatie) createTable(visueel, 'protocol')

      const elementen = []

      // Functie die een bepaalde tijd wacht voordat het verder gaat. Hiermee wordt een animatie-effect bereikt.
      const timer = ms => new Promise(res => setTimeout(res, ms))

      async function load () { // Deze lus moet in een async functie worden gewikkeld om te kunnen werken met de asynchrone functie 'await'
        for (const row of gedrag) {
          for (const x of row) {
            try {
              if ((elementen.indexOf(x)) == -1) throw 'not in list'
            } catch (err) {
              if (err = 'not in list') {
                elementen.push(x)
                if (animatie) {
                  changeBackgroundColor(getColor(elementen.indexOf(x)), 'protocol-' + gedrag.indexOf(row) + '-' + (row.indexOf(x) + 1))
                  await timer(250) // Wacht 250 milliseconden als er een animatie wordt weergegeven.
                }
              }
            }
          }
        }

        if (animatie) {
          await timer(1000) // Wacht 1 seconde als er een animatie wordt weergegeven.

          // Reset de achtergrondkleur van de tabel naar de oorspronkelijke staat.
          for (const row of gedrag) {
            for (const x of row) {
              changeBackgroundColor(getColor(-1), 'protocol-' + gedrag.indexOf(row) + '-' + (row.indexOf(x) + 1))
            }
          }
        }

        // Bereid de sequentietabel voor en zet streepjes bij hetzelfde gedrag.
        const tabel = []; const visueelTabel = []

        for (const i of elementen) {
          const tabelRow = []
          for (const j of elementen) {
            if (j == i) {
              tabelRow.push('-')
            } else {
              tabelRow.push(0)
            }
          }
          tabel.push(tabelRow)
        }

        for (const item of tabel) {
          const row = []
          row.push(elementen[tabel.indexOf(item)])
          for (const x of item) {
            row.push(x)
          }
          visueelTabel.push(row)
        }

        // Voeg de elementen toe als headers.
        const elementenRow = ['']
        for (const element of elementen) {
          elementenRow.push(element)
        }
        visueelTabel.unshift(elementenRow)
        if (animatie) createTable(visueelTabel, 'sequentie')

        // Tel alle sequenties en vul de sequentietabel met de juiste waarden.
        let huidigeElement; let huidigId; let laatsteElement = ''; let laatsteId = ''; let vorigId = ''

        for (const rij of gedrag) {
          for (i = 0; i < rij.length; i++) {
            huidigeElement = rij[i]
            huidigId = 'protocol-' + gedrag.indexOf(rij) + '-' + (i + 1)
            if (animatie) changeBackgroundColor(getColor(elementen.indexOf(huidigeElement)), huidigId)
            if (laatsteElement != huidigeElement && laatsteElement != '') {
              const rij = tabel[elementen.indexOf(laatsteElement)]
              rij[elementen.indexOf(huidigeElement)] += 1
              if (animatie) {
                document.getElementById('sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1)).textContent = rij[elementen.indexOf(huidigeElement)]
                changeBackgroundColor(getColor(-2), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1))
                changeTextColor('white', 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1))
              }
            }

            if (animatie) {
              changeBackgroundColor(getColor(elementen.indexOf(huidigeElement)), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-0')
              changeBackgroundColor(getColor(elementen.indexOf(laatsteElement)), 'sequentie-0-' + (elementen.indexOf(laatsteElement) + 1))
            }

            if (animatie) {
              await timer(100) // Wacht 100 milliseconden als er een animatie wordt weergegeven.

              changeBackgroundColor(getColor(-1), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1))
              changeTextColor('inherit', 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1))
              changeBackgroundColor(getColor(-1), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-0')
              changeBackgroundColor(getColor(-1), 'sequentie-0-' + (elementen.indexOf(laatsteElement) + 1))
            }

            laatsteId = vorigId
            vorigId = huidigId
            laatsteElement = huidigeElement
          }
        }

        // Voeg de elementen toe als headers aan de tabel.
        for (const element of elementen) {
          const index = elementen.indexOf(element)
          tabel[index].unshift(element)
        }
        elementen.unshift('')
        tabel.unshift(elementen)

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
          link.setAttribute('download', 'sequentietabel.csv')
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
  })
}
