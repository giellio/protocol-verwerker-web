function sequentietabel() {
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

               var gedrag = [];
               // Loop on the row Array (change row=0 if you also want to read 1st row)
               for (var row = 1; row < rowData.length; row++) {
                    var rawRow = rowData[row];
                    rawRow = rawRow.split(",");
                    rawRow.shift();
                    var elementenRow = [];
                    //verzamel alle gedragselementen netjes in een 2d array
                    for (var elementNumber = 0; elementNumber < rawRow.length; elementNumber++) {
                         var element = rawRow[elementNumber];
                         element = element.replace('"', "").replace("\r", "");
                         element = element.split(",");
                         if (Array.isArray(element)) {
                              for (let x of element) {
                                   elementenRow.push(x.toString().toLowerCase().trim());
                              }
                         } else {
                              elementenRow.push(element.toString().toLowerCase().trim());
                         }
                    }
                    gedrag.push(elementenRow);
               }

               var elementen = [];

               //maak een lijstje met alle verschillende gedrageenheden
               for (let row of gedrag) {
                    for (let x of row) {
                         try {
                              if ((elementen.indexOf(x)) == -1) throw "not in list";
                         } catch (err) {
                              if (err = "not in list") {
                                   elementen.push(x);
                              }
                         }
                    }
               }

               var tabel = [];

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

               //tel alle sequenties
               var huidigeElement, laatsteElement = "";
               for (let rij of gedrag) {
                    for (let element of rij) {
                         huidigeElement = element;
                         if (laatsteElement != huidigeElement && laatsteElement != "") {
                              let rij = tabel[elementen.indexOf(laatsteElement)];
                              let element = rij[elementen.indexOf(huidigeElement)];
                              rij[elementen.indexOf(huidigeElement)] += 1;
                         }
                         laatsteElement = huidigeElement
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
          };

     } else {
          alert("Selecteer een bestand.");
     }
} 