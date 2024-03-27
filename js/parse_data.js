// Functie om de data uit het gegeven bestand te verwerken en in een 2D-array te zetten.
// rowData: een array met de rijgegevens uit het bestand.
// tijd: een boolean-waarde die aangeeft of er tijdsinformatie in dezelfde 2D-array of in een apparte array gegeven moet worden.

export function parse_result (rowData, tijd) {
  // Initialiseren van arrays om de resultaten op te slaan.
  const resultTijden = []
  const result = []

  // Loop door elke rij (we beginnen bij index 1, omdat index 0 de kop van de kolommen bevat).
  for (let row = 1; row < rowData.length; row++) {
    // De ruwe gegevens van de huidige rij opsplitsen op basis van komma's.
    let rawRow = rowData[row]
    rawRow = rawRow.split(',')

    // Als 'tijd' op 'false' staat, de eerste waarde in de rij (de tijd) verwijderen en in de resultTijden-array plaatsen.
    if (tijd == false) {
      resultTijden.push(rawRow.shift())
    }

    // Een array om de elementen van de huidige rij op te slaan.
    const elementenRow = []

    // Loop door elk element in de ruwe rijgegevens.
    for (let elementNumber = 0; elementNumber < rawRow.length; elementNumber++) {
      let element = rawRow[elementNumber]

      // Verwijder overbodige karakters zoals aanhalingstekens en nieuwe-regel-tekens.
      element = element.replace('"', '').replace('\r', '')

      // Als het element een komma bevat, splitsen we het verder op en voegen de afzonderlijke delen toe aan elementenRow.
      element = element.split(',')
      if (Array.isArray(element)) {
        for (const x of element) {
          if (x != ' ' && x.length !== 0) {
            // Zet elk element in kleine letters en verwijder witruimte aan het begin en einde, en voeg het toe aan de elementenRow-array.
            elementenRow.push(x.toString().toLowerCase().trim())
          }
        }
      } else {
        // Als het element geen komma bevat, voegen we het gewoon toe aan de elementenRow-array.
        if (element != ' ') {
          elementenRow.push(element.toString().toLowerCase().trim())
        }
      }
    }

    // Voeg de elementenRow-array toe aan de result-array.
    result.push(elementenRow)
  }

  // Als 'tijd' op 'true' staat, retourneer alleen de result-array.
  // Anders, retourneer zowel de result-array als de resultTijden-array.
  if (tijd) {
    return result
  } else {
    return [result, resultTijden]
  }
}