function sequentietabel() {
     const content = document.getElementById("table");
     content.textContent = '';
     var files = document.querySelector('#file').files;

     if (files.length > 0) {

          // Selected file
          var file = files[0];

          // FileReader Object
          var reader = new FileReader();

          // Read file as string 
          reader.readAsText(file);

          // Load event
          reader.onload = function (event) {

               // Read file data
               var csvdata = event.target.result;

               // Split by line break to gets rows Array
               var rowData = csvdata.split('\n');

               var tijden = [], gedrag = [], visueel = [];
               // Loop on the row Array (change row=0 if you also want to read 1st row)

               var visueel = parse_result(rowData, true);
               var gedragRaw = parse_result(rowData, false);

               var gedrag = gedragRaw[0];
               var alleTijden = gedragRaw[1];

               createTable(visueel, 'protocol');

               var elementen = [];

               // Returns a Promise that resolves after "ms" Milliseconds
               const timer = ms => new Promise(res => setTimeout(res, ms))

               async function load() { // We need to wrap the loop into an async function for this to work
                    for (let row of gedrag) {
                         for (let x of row) {
                              try {
                                   if ((elementen.indexOf(x)) == -1) throw "not in list";
                              } catch (err) {
                                   if (err = "not in list") {
                                        elementen.push(x);
                                        changeBackgroundColor(getColor(elementen.indexOf(x)), 'protocol-' + gedrag.indexOf(row) + "-" + (row.indexOf(x) + 1));
                                        await timer(250);
                                   }
                              }
                         }
                    }

                    await timer(1000);

                    for (let row of gedrag) {
                         for (let x of row) {
                              changeBackgroundColor(getColor(-1), 'protocol-' + gedrag.indexOf(row) + "-" + (row.indexOf(x) + 1));
                         }
                    }

                    var tabel = [], visueelTabel = [];

                    //bereid de sequentietabel voor, zet streepjes bij hetzelfde gedrag
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

                    var elementenRow = [''];
                    for (let element of elementen) {
                         elementenRow.push(element);
                    }

                    visueelTabel.unshift(elementenRow);
                    createTable(visueelTabel, 'sequentie');

                    //tel alle sequenties
                    var huidigeElement, huidigId, laatsteElement = "", laatsteId = '', vorigId = '';

                    for (let rij of gedrag) {
                         for (i = 0; i < rij.length; i++) {
                              huidigeElement = rij[i];
                              huidigId = 'protocol-' + gedrag.indexOf(rij) + '-' + (i + 1);
                              changeBackgroundColor(getColor(elementen.indexOf(huidigeElement)), huidigId);
                              if (laatsteElement != huidigeElement && laatsteElement != "") {
                                   let rij = tabel[elementen.indexOf(laatsteElement)];
                                   rij[elementen.indexOf(huidigeElement)] += 1;
                                   document.getElementById('sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-' + (elementen.indexOf(laatsteElement) + 1)).textContent = rij[elementen.indexOf(huidigeElement)];
                                   changeBackgroundColor(getColor(-2), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-'+ (elementen.indexOf(laatsteElement) + 1));
                                   changeTextColor('white', 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-'+ (elementen.indexOf(laatsteElement) + 1));
                              }

                              changeBackgroundColor(getColor(elementen.indexOf(huidigeElement)), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-0');
                              changeBackgroundColor(getColor(elementen.indexOf(laatsteElement)), 'sequentie-0-' + (elementen.indexOf(laatsteElement) + 1));

                              if (laatsteId != '') {
                                   console.log(changeBackgroundColor(getColor(-1), laatsteId));
                              }

                              await timer(250);

                              changeBackgroundColor(getColor(-1), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-'+ (elementen.indexOf(laatsteElement) + 1));
                              changeTextColor('inherit', 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-'+ (elementen.indexOf(laatsteElement) + 1));
                              changeBackgroundColor(getColor(-1), 'sequentie-' + (elementen.indexOf(huidigeElement) + 1) + '-0');
                              changeBackgroundColor(getColor(-1), 'sequentie-0-' + (elementen.indexOf(laatsteElement) + 1));

                              laatsteId = vorigId;
                              vorigId = huidigId;
                              laatsteElement = huidigeElement;
                         }
                    }

                    //voeg de elementen toe als headers
                    for (let element of elementen) {
                         let index = elementen.indexOf(element);
                         tabel[index].unshift(element);
                    }
                    elementen.unshift("");
                    tabel.unshift(elementen);

                    //maak het downloadbare csv bestand
                    let csvContent = "data:text/csv;charset=utf-8,";

                    tabel.forEach(function (rowArray) {
                         let row = rowArray.join(",");
                         csvContent += row + "\r\n";
                    });
                    var encodedUri = encodeURI(csvContent);
                    var link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", "sequentietabel.csv");
                    document.body.appendChild(link); // Required for FF

                    link.click(); // This will download the data file named "my_data.csv".
               }

               load();

          };

     } else {
          alert("Selecteer een bestand.");
     }
} 