function frequentietabel() {
     var files = document.querySelector('#file').files;
     var interval = document.querySelector('#frequentie').value;
     interval = Number(interval);
     console.log("interval: " + interval);
     try {
          if (!files.length > 0) throw "Selecteer een bestand.";
          if (interval <= 0) throw "Geef een (geldig) interval.";
     } catch (error) {
          var err = error;
     }

     if (files.length > 0 && interval >= 0) {

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

               var alleTijden = [], tijden = [], gedrag = [];
               // Loop on the row Array (change row=0 if you also want to read 1st row)
               for (var row = 1; row < rowData.length; row++) {
                    var rawRow = rowData[row];
                    rawRow = rawRow.split(",");
                    alleTijden.push(rawRow.shift());
                    var elementenRow = [];
                    //elementen netjes in 2d array gooien
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

               //verzamel de tijden voor de headers van de tijdsintervallen
               for (i = 0; i < alleTijden.length; i += interval) {
                    if (i + interval - 1 < alleTijden.length) {
                         tijden.push(alleTijden[i] + "-" + alleTijden[i + interval - 1]);
                    } else {
                         let over = alleTijden.length % interval;
                         if (over <= 1) {
                              tijden.push(alleTijden[i]);
                         }
                         else {
                              tijden.push(alleTijden[i] + "-" + alleTijden[i + over - 1])
                         }
                    }
               }

               var elementen = [];
               
               //verzamel alle verschillende elementen
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
               var nietGeteldetabel = [];

               //verzamel alle gedragselementen binnen een interval
               for (i = 0; i < (gedrag.length); i += interval) {

                    var elementenInterval = [];
                    for (j = 0; j < interval; j++) {
                         elementenInterval.push(gedrag[i + j]);
                    }
                    nietGeteldetabel.push(elementenInterval);
               }


               //tel de elementen binnen hun frequentie
               for (let rij of nietGeteldetabel) {
                    var elementenRow = [];
                    for (i = 0; i < elementen.length; i++) {
                         elementenRow[i] = 0;
                    }
                    for (let kolom of rij) {
                         try {
                              for (let element of kolom) {
                                   if (elementen.indexOf(element) >= 0) {
                                        elementenRow[elementen.indexOf(element)]++;
                                   }
                              } throw "empty"
                         } catch (error) {
                              if(!error == "empty"){
                                  alert(error); 
                              }
                         }

                    }
                    tabel.push(elementenRow);
               }

               //voeg de tijden toe aan de tabel headers
               for (let tijd of tijden) {
                    let index = tijden.indexOf(tijd);
                    tabel[index].unshift(tijd);
               }
               //voeg de elementen toe aan de tabel headers
               elementen.unshift("");
               tabel.unshift(elementen);

               //creeër het nieuwe csv bestand en maak deze beschikbaar als download
               let csvContent = "data:text/csv;charset=utf-8,";

               tabel.forEach(function (rowArray) {
                    let row = rowArray.join(",");
                    csvContent += row + "\r\n";
               });
               var encodedUri = encodeURI(csvContent);
               var link = document.createElement("a");
               link.setAttribute("href", encodedUri);
               link.setAttribute("download", "frequentietabel.csv");
               document.body.appendChild(link); // Required for FF

               link.click(); // This will download the data file named "my_data.csv".
          };

     } else {
          alert(err);
     }
} 