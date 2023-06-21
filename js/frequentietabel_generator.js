function frequentietabel() {
     const content = document.getElementById("table");
     content.textContent = '';
     const animatie = document.getElementById('animatie').checked;
     var files = document.querySelector('#file').files;
     var interval = document.querySelector('#frequentie').value;
     interval = Number(interval);
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

               var tijden = [], gedrag = [], visueel = [];
               // Loop on the row Array (change row=0 if you also want to read 1st row)

               var visueel = parse_result(rowData, true);
               var gedragRaw = parse_result(rowData, false);

               var gedrag = gedragRaw[0];
               var alleTijden = gedragRaw[1];

               createTable(visueel, 'protocol');

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
                                        if(animatie){
                                             await timer(250);
                                        }
                                   }
                              }
                         }
                    }

                    if(animatie){
                         await timer(2000);

                    }

                    for (let row of gedrag) {
                         for (let x of row) {
                              changeBackgroundColor(getColor(-1), 'protocol-' + gedrag.indexOf(row) + "-" + (row.indexOf(x) + 1));
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

                    var visueelNietGeteldeTabel = [];
                    for (let row of nietGeteldetabel) {
                         var newRow = [];
                         for (let column of row) {
                              try {
                                   for (let item of column) {
                                        newRow.push(item)
                                   } throw 'column empty'
                              } catch (error) {
                                   if (!error == "column empty") {
                                        alert(error);
                                   }
                              }

                         }
                         visueelNietGeteldeTabel.push(newRow);
                    }

                    nietGeteldetabel = [];
                    for (let row of visueelNietGeteldeTabel) {
                         nietGeteldetabel.push(row);
                    }

                    content.textContent = '';

                    console.table(visueelNietGeteldeTabel);
                    console.table(nietGeteldetabel);

                    for (let tijd of tijden) {
                         let index = tijden.indexOf(tijd);
                         visueelNietGeteldeTabel[index].unshift(tijd);
                    }

                    createTable(visueelNietGeteldeTabel, 'teltabel');

                    var tabel = [], elemtenRow = [];
                    for(let element of elementen){
                         elemtenRow.push(element);
                    }
                    tabel.push(elemtenRow);

                    //tel de elementen binnen hun frequentie
                    for (rij of nietGeteldetabel) {
                         var elementenRow = [];
                         for (i = 0; i < elementen.length; i++) {
                              elementenRow[i] = 0;
                         }
                         tabel.push(elementenRow);

                    }

                    for (let tijd of tijden) {
                         let index = tijden.indexOf(tijd);
                         tabel[index + 1].unshift(tijd);
                    }

                    tabel[0].unshift('');

                    createTable(tabel, 'frequentie');

                    for (let rij of nietGeteldetabel) {
                         for (i = 1; i < rij.length; i++) {
                              try {
                                   var element = rij[i];
                                   if (elementen.indexOf(element) >= 0) {
                                        tabel[nietGeteldetabel.indexOf(rij) + 1][elementen.indexOf(element) + 1]++;
                                        changeBackgroundColor(getColor(elementen.indexOf(element)), 'frequentie-'+ (nietGeteldetabel.indexOf(rij) + 1) + '-' + (elementen.indexOf(element) + 1));
                                        document.getElementById('frequentie-'+ (nietGeteldetabel.indexOf(rij) + 1) + '-' + (elementen.indexOf(element) + 1)).textContent = tabel[nietGeteldetabel.indexOf(rij) + 1][elementen.indexOf(element) + 1];
                                         
                                        changeBackgroundColor(getColor(elementen.indexOf(element)), 'teltabel-'+ nietGeteldetabel.indexOf(rij) + '-' + (i));
                                        if(animatie){
                                             await timer(100);
                                        }
                                        changeBackgroundColor(getColor(-1), 'frequentie-'+ (nietGeteldetabel.indexOf(rij) + 1) + '-' + (elementen.indexOf(element) + 1));
                                   } throw "empty"
                              } catch (error) {
                                   if (!error == "empty") {
                                        alert(error);
                                   }
                              }

                         }
                    }

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
               }

               load();
          };

     } else {
          alert(err);
     }
} 