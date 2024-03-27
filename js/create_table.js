// Functie om een visuele tabel in het HTML-bestand te maken op basis van een 2D-array.
function createTable (tableData, idPrefix) {
  // Maak een (nog leeg) tabel-element en een tbody-element.
  const table = document.createElement('table')
  const tableBody = document.createElement('tbody')

  let i = 0
  // Voor iedere rij in de 2D-array, maak een nieuwe rij in de HTML-tabel.
  tableData.forEach(function (rowData) {
    const row = document.createElement('tr')
    let j = 0
    // Voor ieder element in een rij van de 2D-array, geef het element een ID op basis van de index in de 2D-array (bijv. element 4 van rij 2 wordt '2-4') en vul het element in met een nieuwe textnode.
    rowData.forEach(function (cellData) {
      const cell = document.createElement('td')
      cell.id = idPrefix + '-' + i + '-' + j
      cell.style.padding = '4px'
      cell.appendChild(document.createTextNode(cellData))
      row.appendChild(cell)
      j++
    })
    i++

    // Voeg de gemaakte rij toe aan het tbody-element.
    tableBody.appendChild(row)
  })

  // Zoek de 'div' met de id 'table', waarin de tabel geplaatst moet worden.
  const content = document.getElementById('table')

  // Voeg de tabel toe aan de HTML-pagina.
  table.appendChild(tableBody)
  content.appendChild(table)
  content.appendChild(document.createElement('br')) // Voeg een regeleinde toe om ruimte te maken tussen verschillende tabellen.
  content.style.display = 'block' // Stel de weergavestijl in op "block" om ervoor te zorgen dat de tabellen onder elkaar worden weergegeven.
  content.style.margin = 'auto' // Centreer de inhoud van de 'div'.
}

export default {createTable}
export {createTable}