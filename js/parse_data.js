function parse_result(rowData, tijd){
    var resultTijden = [], result = [];
    for (var row = 1; row < rowData.length; row++) {
         var rawRow = rowData[row];
         rawRow = rawRow.split(",");
         if(tijd == false){
              resultTijden.push(rawRow.shift());
         }
         var elementenRow = [];
         //elementen netjes in 2d array gooien
         for (var elementNumber = 0; elementNumber < rawRow.length; elementNumber++) {
              var element = rawRow[elementNumber];
              element = element.replace('"', "").replace("\r", "");
              element = element.split(",");
              if (Array.isArray(element)) {
                   for (let x of element) {
                    if(x != ' '){
                         elementenRow.push(x.toString().toLowerCase().trim());
                    }
                   }
              } else {
               if(element != ' '){
                    elementenRow.push(element.toString().toLowerCase().trim());
               }
              }
         }
         result.push(elementenRow);
    }
    if(tijd){
         return result;
    }else{
         return [result, resultTijden];
    }
}