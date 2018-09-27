(function() {
  var selectBox = document.querySelector('select');
  var displayBox = document.querySelector('#display-box');

  selectBox.addEventListener('change', function(event) {
    displayBox.innerText = selectBox.options[selectBox.selectedIndex].dataset.totalPoints;
  });
})();