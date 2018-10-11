(function() {
  const currentPointsElement = document.querySelector('#current-points');
  const committeePointsElement = document.querySelector('#committee-points');
  const internalPointsElement = document.querySelector('#internal-points');
  const externalPointsElement = document.querySelector('#external-points');
  const pointsCommentElement = document.querySelector('#points-comment');
  const pointsOverviewContainer = document.querySelector('.points-overview');
  const selectElement = document.querySelector('select');

  const okCommentArray = [
    'There\'s still plenty of time left.',
    'Lots of opportunities still available.!',
    'There\'s a lot of year left, don\'t sweat it.',
    'Keep at it, you\'ll get there soon!'
  ];
  const goodCommentArray = [
    'Don\'t stop now!',
    'Looking good, keep going!',
    'Sweet!',
    'Whoa, that\'s great!'
  ];
  const greatCommentArray = [
    'Whoa, over-achiever!',
    'Holy cow!',
    'Going for gold?! Nice!'
  ];

  function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  selectElement.addEventListener('change', function(event) {
    const committeePoints = parseInt(selectElement.options[selectElement.selectedIndex].dataset.committeePoints, 10);
    const currentPoints = parseInt(selectElement.options[selectElement.selectedIndex].dataset.totalPoints, 10);
    const internalPoints = parseInt(selectElement.options[selectElement.selectedIndex].dataset.internalPoints, 10);
    const externalPoints = parseInt(selectElement.options[selectElement.selectedIndex].dataset.externalPoints, 10);

    let pointsComment = '';

    if (currentPoints < 50) {
      pointsComment = okCommentArray[getRandomInt(okCommentArray.length)];
    } else if (currentPoints >= 51 && currentPoints < 100) {
      pointsComment = goodCommentArray[getRandomInt(goodCommentArray.length)];
    } else if (currentPoints >= 100) {
      pointsComment = greatCommentArray[getRandomInt(greatCommentArray.length)];
    } else {
      pointsComment = 'Ok then...? Something weird happened.';
    }

    pointsOverviewContainer.classList.remove('hidden');
    committeePointsElement.innerText = committeePoints;
    currentPointsElement.innerText = currentPoints;
    internalPointsElement.innerText = internalPoints;
    externalPointsElement.innerText = externalPoints;
    pointsCommentElement.innerText = pointsComment;
  });
})();
