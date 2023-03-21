//'readline' module from Node.js
const readline = require("readline");

//declared to use/create the interface from the readline module.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Variables
//Array of cards (Unicode playing card deck composed of different suits)
const cards = [
    "🂡", "🂢", "🂣", "🂤", "🂥", "🂦", "🂧", "🂨", "🂩", "🂪", "🂫", "🂭", "🂮",  // Spades
    "🂱", "🂲", "🂳", "🂴", "🂵", "🂶", "🂷", "🂸", "🂹", "🂺", "🂻", "🂽", "🂾",  // Hearts
    "🃁", "🃂", "🃃", "🃄", "🃅", "🃆", "🃇", "🃈", "🃉", "🃊", "🃋", "🃍", "🃎",  // Diamonds
    "🃑", "🃒", "🃓", "🃔", "🃕", "🃖", "🃗", "🃘", "🃙", "🃚", "🃛", "🃝", "🃞",  // Clubs
];

let playerNumber;

//Functions
//This function randomly pulls a card out of the deck. It removes the card
//that it pull so there is no duplicates in hand.
function getRandomCard() {
  const i = Math.floor(Math.random() * cards.length);
  const card = cards[i];
  cards.splice(i, 1);
  return card;
}

//Returns the card value. Based on the unicode value returned from codePointAt()
//then takes the remainder of being divided by 16. The card is an Ace it returns
//11, the remainder is above 10 will return 10, otherwise it will return the the
//remainder itself as the card value.
function getCardValue(card) {
  const cardValue = card.codePointAt(0) % 16;
  if (cardValue === 1) {
    return 11;
  } else if (cardValue > 10) {
    return 10;
  } else {
    return cardValue;
  }
}

//Returns the hand value mostly by calling the card value from the for loop.
//Has a special way to handle the aces of the hand. In the game of blackjack,
//aces can be worth either 1 or 11 points, which ever is more beneficial to
//the holder. This is why the aces are counted in the for loop. Then if the
//hand value is over 21 then the card value of the ace will change in the
//while loop to a 1.
function getHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (const card of hand) {
    value += getCardValue(card);
    if (getCardValue(card) === 11) {
      aces++;
    }
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

//The main function. Declares the initial and displays the hands to the console when
//needed. Has the logic of the blackjack game. Is further defined in the function 
//itself.
async function playBlackjack() {

    const plays = new Map();

    //loop looks for the additional player number as input from the user(s).
    while (typeof playerNumber === 'undefined') {
        //await pauses the while loop until the promise is resolved.
        const answer = await new Promise((resolve) => {
            rl.question("Can add up to 5 additional players including dealer and the initial player. \nHow many additional players would you like? ", (input) => {
                resolve(input.toLowerCase());
            });
        });

        //only accepts a player number between 0-5
        if (0 <= answer && answer <= 5) {
            playerNumber = parseInt(answer)+2;
            break;
        } else {
            console.log("Invalid input. Please type a number between '0-5'.");
        }
    }

    //initializes starting deck for all players
    for (let i = 0; i < playerNumber; i++) {
        plays.set(i, [getRandomCard(), getRandomCard()])
    }

    //goes through the plays of each player
    for (const play of plays) {
        if (play[0] === 0)
            console.log(`Dealer's upcard: ${play[1][0]} (${getCardValue(play[1][0])})`);
        else
            //while loop to collect the actions from the user.
            while (getHandValue(play[1]) < 21) {
                if (play[1].length < 3) {
                    console.log(`Player ${play[0]}'s Turn`);
                    console.log(`Player ${play[0]}'s hand: ${play[1].join(" ")} (${getHandValue(play[1])})`);
                }
                //await pauses the while loop until the promise is resolved.
                const answer = await new Promise((resolve) => {
                    rl.question(`Does Player ${play[0]} want to hit or stand? `, (input) => {
                        resolve(input.toLowerCase());
                    });
                });

                //Based on what you get from the response in the promise. These conditions will trigger.
                //hit action
                if (answer === "hit") {
                    play[1].push(getRandomCard());
                    console.log(`Player ${play[0]} hand: ${play[1].join(" ")} (${getHandValue(play[1])})`);
                    //stand action
                } else if (answer === "stand") {
                    break;
                    //default action
                } else {
                    console.log("Invalid input. Please type 'hit' or 'stand'.");
                }
            }
    }

    //the dealer will draw another card if their hand is not over 17
    while (getHandValue(plays.get(0)) < 17) {
        plays.get(0).push(getRandomCard());
        console.log(`Dealer's hand: ${plays.get(0).join(" ")} (${getHandValue(plays.get(0))})`);
    }

    //determines if the players win or lose to the dealer
    const dealerhand = getHandValue(plays.get(0))
    console.log('Blackjack Results: ')
    for (const play of plays) {
        const playerhand = getHandValue(play[1])
        if (play[1] === 0) {
            console.log(`Dealer's hand: ${play[1].join(" ")} (${dealerhand})`);
        } else if (playerhand > 21) {
            console.log(`Player ${play[0] + 1} busted! Dealer wins.`);
        } else if (dealerhand > 21) {
            console.log(`Dealer busted! Player ${play[0] + 1} wins.`);
        } else if (playerhand > dealerhand) {
            console.log(`Player ${play[0] + 1} wins!`);
        } else if (playerhand < dealerhand) {
            console.log(`Dealer wins. Player ${play[0] + 1} loses.`);
        } else {
            console.log(`Player ${play[0] + 1} and the dealer tied.`);
        }
    }


  //closes the input stream of the 'readline' module and exits program.
  rl.close();
}

//Calls the main method.
playBlackjack();
