// Functie om een sequentietabel te genereren.
function sequentietabel(file, only = false) {
     return new Promise((resolve, reject) => {
          const content = document.getElementById("table");
          const animatie = document.getElementById('animatie').checked;
          
          if(animatie)
               content.textContent = `${file.name} - Sequentietabel`;
          else
               content.textContent = '';
          let csvRows = [];



          // FileReader Object
          var reader = new FileReader();

          // Lees het bestand als een tekstbestand.
          reader.readAsText(file);

          // Laad event
          reader.onload = function (event) {
               // Lees de gegevens van het bestand.
               var csvdata = event.target.result;

               // Split de data in regels om een array van rijen te krijgen.
               var rowData = csvdata.split('\n');

               // Voorbereiden van de arrays om de gegevens te verwerken.
               var tijden = [], gedrag = [], visueel = [];

               // Lees de informatie uit het bestand en zet deze in de variabelen: visueel met tijden, gedragRaw zonder tijden.
               var visueel = parse_result(rowData, true);
               var gedragRaw = parse_result(rowData, false);

               // Zet de gegevens om in een leesbare tabel voor visuele weergave ('protocol') en toon deze.
               var gedrag = gedragRaw[0];
               if (animatie) createTable(visueel, 'protocol');


               var elementen = [];

               // Functie die een bepaalde tijd wacht voordat het verder gaat. Hiermee wordt een animatie-effect bereikt.
               const timer = ms => new Promise(res => setTimeout(res, ms))

               async function load() { // Deze lus moet in een async functie worden gewikkeld om te kunnen werken met de asynchrone functie 'await'
                    for (let row of gedrag) {
                         for (let x of row) {
                              try {
                                   if ((elementen.indexOf(x)) == -1) throw "not in list";
                              } catch (err) {
                                   if (err = "not in list") {
                                        elementen.push(x);
                                     
                                        if (animatie) {
                                             changeBackgroundColor(getColor(elementen.indexOf(x)), 'protocol-' + gedrag.indexOf(row) + "-" + (row.indexOf(x) + 1));

                                             await timer(250); // Wacht 250 milliseconden als er een animatie wordt weergegeven.
                                        }
                                   }
                              }
                         }
                    }

                    if (animatie) {
                         await timer(1000); // Wacht 1 seconde als er een animatie wordt weergegeven.

                         // Reset de achtergrondkleur van de tabel naar de oorspronkelijke staat.
                         for (let row of gedrag) {
                              for (let x of row) {
                                   changeBackgroundColor(getColor(-1), 'protocol-' + gedrag.indexOf(row) + "-" + (row.indexOf(x) + 1));
                              }
                         }
                    }

                    // Bereid de sequentietabel voor en zet streepjes bij hetzelfde gedrag.
                    var tabel = [], visueelTabel = [];

                    for (let i of elementen) {
                         let tabelRow = [];
                         for (let j of elementen) {
                              if (j == i) {
                                   tabelRow.push("-");
                              } else {
                                   tabelRow.push(0);
                              }
                         }
                         tabel.push(tabelRow);
                    }

                    for (let item of tabel) {
                         var row = [];
                         row.push(elementen[tabel.indexOf(item)]);
                         for (let x of item) {
                              row.push(x);
                         }
                         visueelTabel.push(row);
                    }

                    // Voeg de elementen toe als headers.
                    var elementenRow = [''];
                    for (let element of elementen) {
                         elementenRow.push(element);
                    }
                    visueelTabel.unshift(elementenRow);
                    if (animatie) createTable(visueelTabel, 'sequentie');

                    // Tel alle sequenties en vul de sequentietabel met de juiste waarden.
                    var huidigeElement, huidigId, laatsteElement = "", laatsteId = '', vorigId = '';

                    for (let rij of gedrag) {
                         for (i = 0; i < rij.length; i++) {
                              huidigeElement = rij[i];
                              huidigId = 'protocol-' + gedrag.indexOf(rij) + '-' + (i + 1);
                              if (animatie) changeBackgroundColor(getColor(elementen.indexOf(huidigeElement)), huidigId);
                              if (laatsteElement != huidigeElement && laatsteElement != "") {
                                   let rij = tabel[elementen.indexOf(laatsteElement)];
                                   rij[elementen.indexOf(huidigeElement)] += 1;

                                   if (animatie) {
                                        document.getElementById('sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1)).textContent = rij[elementen.indexOf(huidigeElement)];
                                        changeBackgroundColor(getColor(-2), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1));
                                        changeTextColor('white', 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1));
                                   }
                              }

                              if (animatie) {
                                   changeBackgroundColor(getColor(elementen.indexOf(huidigeElement)), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-0');
                                   changeBackgroundColor(getColor(elementen.indexOf(laatsteElement)), 'sequentie-0-' + (elementen.indexOf(laatsteElement) + 1));
                              }

                              if (animatie) {
                                   await timer(100); // Wacht 100 milliseconden als er een animatie wordt weergegeven.

                                   changeBackgroundColor(getColor(-1), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1));
                                   changeTextColor('inherit', 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1));
                                   changeBackgroundColor(getColor(-1), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-0');
                                   changeBackgroundColor(getColor(-1), 'sequentie-0-' + (elementen.indexOf(laatsteElement) + 1));
                              }

                              laatsteId = vorigId;
                              vorigId = huidigId;
                              laatsteElement = huidigeElement;
                         }
                    }

                    // Voeg de elementen toe als headers aan de tabel.
                    for (let element of elementen) {
                         let index = elementen.indexOf(element);
                         tabel[index].unshift(element);
                    }
                    elementen.unshift("");
                    tabel.unshift(elementen);

                    // Maak het downloadbare csv-bestand aan voor de sequentietabel.

                    tabel.forEach(function (rowArray) {
                         let row = rowArray.join(",");
                         csvRows.push(row);
                    });

                    let csvContent = csvRows.join("\r\n");

                    if (only) {
                         var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
                         var link = document.createElement("a");
                         link.setAttribute("href", encodedUri);
                         link.setAttribute("download", "sequentietabel.csv");
                         document.body.appendChild(link);

                         link.click();
                         resolve(); // Resolve the promise
                    } else {
                         resolve(csvContent); // Resolve the promise with csvContent
                    }

               }

               load();
          };

          reader.onerror = function (event) {
               reject(event.error); // Reject the promise in case of an error
          };
     });
}