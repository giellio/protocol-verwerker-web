function changeBackgroundColor(color, id){
    var element = document.getElementById(id);
    element.style.background = color;
}

function getColor(id){
    var arr = [
        '#eb4034',
        '#ebde34',
        '#34dbeb',
        '#a834eb',
        '#eb34db',
        '#3deb34',
        '#eb8334',
        '#2730d9',
        '#27d974',
        '#d92736'
    ]
    var color 
    if(id == -1){
        color = 'none';
    } else{
        color = arr[id % arr.length];
    }
    return color;
}