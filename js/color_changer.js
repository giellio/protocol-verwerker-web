// Functie om de achtergrondkleur van een element te veranderen op basis van een ID.
function changeBackgroundColor(color, id) {
    var element = document.getElementById(id);
    element.style.background = color;
}

// Functie om de tekstkleur van een element te veranderen zodat deze leesbaar blijft op basis van een ID.
// Bijvoorbeeld: een zwarte tekst wit maken als de achtergrond een donkere kleur wordt.
function changeTextColor(color, id) {
    var element = document.getElementById(id);
    element.style.color = color;
}

// Systeem om een kleur op te halen op basis van een ID.
// Dit zorgt ervoor dat kleuren makkelijk kunnen worden veranderd zonder dat ze elders in de code moeten worden opgezocht.
function getColor(id) {
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
    ];
    var color;
    if (id == -1) {
        color = 'none'; // Als het ID -1 is, wordt de kleur 'none' teruggegeven, wat betekent dat er geen achtergrondkleur wordt ingesteld.
    } else if (id == -2) {
        color = '#555'; // Als het ID -2 is, wordt de kleur '#555' teruggegeven, wat een donkergrijze kleur is.
    } else {
        color = arr[id % arr.length]; // Als het ID positief is, wordt een kleur uit de array 'arr' gekozen op basis van het ID.
        // De kleur wordt gekozen door het ID modulo de lengte van de array, wat ervoor zorgt dat de kleuren circulair worden herhaald als het ID groter is dan het aantal beschikbare kleuren in de array.
    }
    return color; // De gekozen kleur wordt geretourneerd.
}
