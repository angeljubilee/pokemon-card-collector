/* global data, showView, setCardCount */
/* exported $views, $cardCount */

var pokemonCardSets = {
  sets: [],
  pageNum: 0,
  numPerPage: 16
};

var pokemonCards = {
  cards: [],
  pageNum: 0,
  numPerPage: 15
};

var seriesLogo = '';
var cardSetNames = [];

var $logosUL = document.querySelector('.logos');
var $search = document.querySelector('input');
var $nextPage = document.querySelector('.next-link');
var $pokemonCard = document.querySelector('.pokemon-card');
var $addButton = document.querySelector('.add-button');
var $backLink = document.querySelector('.back-link');
var $cardsUL = document.querySelector('.cards');
var $logo = document.querySelector('.series-logo');
var $main = document.querySelector('.main-header');
var $views = document.querySelectorAll('.view');
var $cardCount = document.querySelectorAll('.card-count');
var $myDeckLink = document.querySelectorAll('.my-deck');
var $myDeck = document.querySelector('.myDeck');

window.addEventListener('DOMContentLoaded', loadData);
$logosUL.addEventListener('click', handleLogoClick);
$search.addEventListener('keypress', handleSearch);
$nextPage.addEventListener('click', handleNextPageClick);
$cardsUL.addEventListener('click', handleCardClick);
$addButton.addEventListener('click', handleAddClick);
$backLink.addEventListener('click', handleBackClick);
$myDeckLink[0].addEventListener('click', handleMyDeckClick);
$myDeckLink[1].addEventListener('click', handleMyDeckClick);

function loadData(event) {
  setCardCount();
  getPokemonCardSets();
}

function handleLogoClick(event) {
  if (!event.target.matches('img')) {
    return;
  }
  var setIndex = event.target.closest('li').getAttribute('set-id');
  getPokemonCards(pokemonCardSets.sets[setIndex].id);
  seriesLogo = pokemonCardSets.sets[setIndex].images.logo;
}

function handleSearch(event) {
  if (event.keyCode !== 13) {
    return;
  }

  var setID = cardSetNames.indexOf($search.value.toLowerCase());
  if (setID > -1) {
    getPokemonCards(setID);
    seriesLogo = pokemonCardSets.sets[setID].images.logo;
  } else {
    getPokemonCardsByPokemon($search.value);
  }
  $search.value = '';
}

function handleNextPageClick(event) {
  var start = 0;
  if (data.view === 'logos') {
    start = pokemonCardSets.pageNum * pokemonCardSets.numPerPage;
    hidePage($logosUL.children, start, start + pokemonCardSets.numPerPage);
    pokemonCardSets.pageNum++;
    start = pokemonCardSets.pageNum * pokemonCardSets.numPerPage;
    createLogosDOM(start, start + pokemonCardSets.numPerPage);
    return;
  }
  if (data.view === 'cards') {
    start = pokemonCards.pageNum * pokemonCards.numPerPage;
    hidePage($cardsUL.children, start, start + pokemonCards.numPerPage);
    pokemonCards.pageNum++;
    start = pokemonCards.pageNum * pokemonCards.numPerPage;
    createCardsDOM(start, start + pokemonCards.numPerPage);
  }
  if (data.view === 'myDeck') {
    start = data.pageNum * data.numPerPage;
    hidePage($myDeck.children, start, start + data.numPerPage);
    data.pageNum++;
    start = data.pageNum * data.numPerPage;
    createMyDeckDOM(start, start + data.pageNum);
  }
}

function handleCardClick(event) {
  if (!event.target.matches('img')) {
    return;
  }
  var cardIndex = event.target.getAttribute('data-view');
  var pokemonCard = pokemonCards.cards[cardIndex];
  $pokemonCard.setAttribute('src', pokemonCard.images.large);
  $pokemonCard.setAttribute('data-view', cardIndex);
  showView('add');
}

function handleAddClick(event) {
  var cardIndex = $pokemonCard.getAttribute('data-view');
  data.myDeck.push(pokemonCards.cards[cardIndex]);
  setCardCount();
  showView('cards');
}

function handleBackClick(event) {
  showView('cards');
}

function handleMyDeckClick(event) {
  var start = data.pageNum * data.numPerPage;
  createMyDeckDOM(start, start + data.numPerPage);
  showView('myDeck');
}

function getPokemonCardSets() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate');
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCardSets.sets = xhr.response.data;
    var start = pokemonCardSets.numPerPage * pokemonCardSets.pageNum;
    createLogosDOM(start, start + pokemonCardSets.numPerPage);
    pokemonCardSets.sets.forEach(set => {
      cardSetNames.push(set.name.toLowerCase());
    });
  });
  xhr.send();
}

function getPokemonCards(series) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/cards?q=set.id:' + series);
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCards.cards = xhr.response.data;
    var start = pokemonCards.pageNum * pokemonCards.numPerPage;
    createCardsDOM(start, start + pokemonCards.numPerPage);
  });
  xhr.send();
}

function getPokemonCardsByPokemon(name) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.pokemontcg.io/v2/cards?q=name:' + name);
  xhr.setRequestHeader('X-Api-Key', 'e29addcb-977c-449c-8e43-f97935b91eb6');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    pokemonCards.cards = xhr.response.data;
    var start = pokemonCards.pageNum * pokemonCards.numPerPage;
    createCardsDOM(start, start + pokemonCards.numPerPage);
  });
  xhr.send();
}

function createLogosDOM(start, end) {
  for (var i = start; i < end; i++) {
    if (i >= pokemonCardSets.length) {
      return;
    }
    var $li = document.createElement('li');
    $li.className = 'column-fourth';
    $li.setAttribute('set-id', i);
    var $img = document.createElement('img');
    $img.setAttribute('src', pokemonCardSets.sets[i].images.logo);
    $li.appendChild($img);
    $logosUL.appendChild($li);
  }
}

function createCardsDOM(start, end) {
  for (var i = start; i < end; i++) {
    if (i >= pokemonCards.cards.length) {
      break;
    }
    var $li = document.createElement('li');
    $li.className = 'column-fifth';
    var $img = document.createElement('img');
    $img.setAttribute('src', pokemonCards.cards[i].images.small);
    $img.setAttribute('data-view', i);
    $li.appendChild($img);
    $cardsUL.appendChild($li);
  }

  data.view = 'cards';
  $main.className += ' hidden';
  $logo.children[0].setAttribute('src', seriesLogo);
  $logo.className = 'series-logo';
  showView('cards');
}

function createMyDeckDOM(start, end) {
  for (var i = start; i < end; i++) {
    if (i >= data.myDeck.length) {
      break;
    }
    var $li = document.createElement('li');
    $li.className = 'column-half text-left';
    var $h4 = document.createElement('h4');
    $h4.textContent = data.myDeck[i].name;
    $li.appendChild($h4);
    var $img = document.createElement('img');
    $img.setAttribute('src', data.myDeck[i].images.large);
    $img.setAttribute('data-view', i);
    $li.appendChild($img);
    $myDeck.appendChild($li);
  }

  data.view = 'myDeck';
  $main.className += 'main-header';
  $logo.className += ' hidden';
  showView('myDeck');
}

function hidePage(elementArray, start, end) {
  for (var i = start; i < end; i++) {
    if (i >= elementArray.length) {
      return;
    }
    elementArray[i].className = 'hidden';
  }
}