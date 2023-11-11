function openPopup () {
  // Display the pop-up
  $('#loadPopup').show('fast', 'swing')
}

function closePopup () {
  // Hide the pop-up
  $('#loadPopup').hide('fast', 'swing')
}

function popupText (text) {
  document.getElementById('loadPopupText').textContent = text
}
