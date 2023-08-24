function ethogram(files) {
    var elementen = []
    files.forEach(file => {
        for (let x of file.elementen) {
            try {
                if ((elementen.indexOf(x)) == -1) throw "not in list";
            } catch (err) {
                if (err = "not in list") {
                    elementen.push(x);
                }
            }
        }
    });

    var ethogram = [["Afkorting", "Gedrag", "Beschrijving"]]
    elementen.forEach(element => {
        ethogram.push([element, '', ''])
    });

    ethogram.forEach(function (rowArray) {
         let row = rowArray.join(",");
         csvContent += row + "\r\n";
    });

    return csvContent;
}

var files = document.querySelector('#file').files;

ethogram(files);