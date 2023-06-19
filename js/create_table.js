function createTable(tableData, idPrefix) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');

    let i = 0;
    tableData.forEach(function (rowData) {
        var row = document.createElement('tr');
        let j = 0;
        rowData.forEach(function (cellData) {
            var cell = document.createElement('td');
            cell.id = idPrefix + "-" + i + "-" + j;
            cell.style.padding = '4px';
            cell.appendChild(document.createTextNode(cellData));
            row.appendChild(cell);
            j++;
        });
        i++;

        tableBody.appendChild(row);
    });

    const content = document.getElementById("table");
    
    table.appendChild(tableBody);
    content.appendChild(table);
    content.appendChild(document.createElement('br'))
    content.style.display = "block";
    content.style.margin = "auto";
}