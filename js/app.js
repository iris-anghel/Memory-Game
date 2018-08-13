// vanilla js, a little jQuery, only a little ES6

// cards list
const cardsList = ["diamond", "gift", "angellist", "music", "cut", "umbrella", "headphones", "paw", "diamond", "gift", "angellist", "music", "cut", "umbrella", "headphones", "paw"];

// most variables

const deck = document.querySelector(".deck");
let openCards = [];
let matchCards = [];
let moves = 0;
let timerNotRunning = true;
let clicksCounter = 0;
let interval;
let card = document.querySelectorAll(".card");

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// the cards are shuffled, and then each card is added dinamically to the deck

function displayCards() {
    let cards = shuffle(cardsList);
    cards.forEach(function(card) {
        $(deck).append(`<li class="card"><i class="fa fa-${card}"></i></li>`)
    });
}

displayCards();

// event listener for clicking on cards

deck.addEventListener("click", clickTheCard, false);

// click the cards functions

function clickTheCard(e) {
    
    if (e.target.tagName === "LI") {
        // start the timer only on first click
        startTimer();

        // only 2 cards can be opened
        if (openCards.length < 2)  {
            e.target.classList.add("open");
            e.target.classList.toggle("disabled");

            // add the cards to a list of open cards
            openCards.push(e.target);
            let cardPick1 = openCards[0];
            let cardPick2 = openCards[1];

            //  if the list contains another card, do they match?
            if (openCards.length === 2) {
                if (cardPick1.innerHTML === cardPick2.innerHTML) {
                    matchedCards();              
                } else {
                    setTimeout(unmatchedCards, 500);
                }

                // moves are updated and displayed
                moves++;
                document.getElementById("moves").innerHTML = moves;
            }
            clicksCounter++;
            removeStar();

            // the game is won
            if (matchCards.length === 16) {
                showModal();
            }
        }
    }
}

function matchedCards() {
    // we have the "list" of open cards. classes are added/removed accordingly
    let cardPick1 = openCards[0];
    let cardPick2 = openCards[1];
    cardPick1.classList.add("match");
    cardPick2.classList.add("match");
    cardPick1.classList.remove("open");
    cardPick2.classList.remove("open");
    matchCards.push(cardPick1);
    matchCards.push(cardPick2);
    openCards = [];
}

function unmatchedCards() {
    openCards[0].classList.remove("open", "disabled");
    openCards[1].classList.remove("open", "disabled");
    openCards = [];
}

// Timer from https://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript

function timer() {
	let sec = 0;
	function pad ( val ) { 
        return val > 9 ? val : "0" + val;
    }
	interval = setInterval( function(){
		document.getElementById("seconds").innerHTML = pad(++sec%60);
		document.getElementById("minutes").innerHTML = pad(parseInt(sec/60,10));
	}, 1000);
}

function startTimer() {
    if (timerNotRunning === true) {
        timer();
        timerNotRunning = false;
    }
}

function stopTimer() {
    clearInterval(interval);
}

// star rating

function removeStar() {
    if (clicksCounter == 30) {
        document.querySelector(".fa-star:last-of-type").classList.remove("fa-star");
    } else if (clicksCounter == 40) {
        document.querySelector(".fa-star:last-of-type").classList.remove("fa-star");
    }
}

// restart button

const restartButton = document.querySelector("#game-restart");
restartButton.addEventListener("click", function() {
    document.location.reload();
});


// the modal

function showModal() {
    // declare variables, show modal, stop the timer, display stars, moves, time
    
    const modal = document.getElementById("modal");
    modal.classList.remove("modal-hide");
    const closeModal = document.getElementsByClassName("modal__close")[0];
    const replay = document.getElementById("replay-game");

    stopTimer();
    
    let finalMin = document.querySelector("#minutes").innerHTML;
    let finalSec = document.querySelector("#seconds").innerHTML;
    let starRating = document.querySelector(".score-panel__stars").innerHTML;

    document.getElementById("end-game-moves").innerHTML = moves;
    document.getElementById("end-game-stars").innerHTML = starRating;
    document.getElementById("end-game-mins").innerHTML = finalMin;
    document.getElementById("end-game-secs").innerHTML = finalSec;

    closeModal.addEventListener("click", function() {
        modal.classList.add("modal-hide");
    })

    replay.addEventListener("click", function() {
        document.location.reload();
    })   
}