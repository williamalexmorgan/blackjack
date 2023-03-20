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
  //Initial Hands
  const playerHand = [getRandomCard(), getRandomCard()];
  const dealerHand = [getRandomCard(), getRandomCard()];

  //Display Intial Hands
  console.log(`Your hand: ${playerHand.join(" ")} (${getHandValue(playerHand)})`);
  console.log(`Dealer's upcard: ${dealerHand[0]} (${getCardValue(dealerHand[0])})`);

    //while loop to collect the actions from the user.
    while (getHandValue(playerHand) < 21) {
        //await pauses the while loop until the promise is resolved.
        const answer = await new Promise((resolve) => {
            rl.question("Do you want to hit or stand? ", (input) => {
            resolve(input.toLowerCase());
            });
        });

        //Based on what you get from the response in the promise. These conditions will trigger.
        //hit action
        if (answer === "hit") {
            playerHand.push(getRandomCard());
            console.log(`Your hand: ${playerHand.join(" ")} (${getHandValue(playerHand)})`);
        //stand action
        } else if (answer === "stand") {
            break;
        } else {
        //default action
            console.log("Invalid input. Please type 'hit' or 'stand'.");
        }
    }

  //If the player's hand ever goes over 21, they lose.
  if (getHandValue(playerHand) > 21) {
    console.log("You busted! Dealer wins.");
    rl.close();
    return;
  }

  console.log(`Dealer's hand: ${dealerHand.join(" ")} (${getHandValue(dealerHand)})`);

  //the dealer will draw another card if their hand is not over 17
  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(getRandomCard());
    console.log(`Dealer's hand: ${dealerHand.join(" ")} (${getHandValue(dealerHand)})`);
  }

  //Condition determines who wins
  //Dealer's hand is over 21 then player wins
  if (getHandValue(dealerHand) > 21) {
    console.log("Dealer busted! You win!");
  //Player wins if his hand is not over 21, but higher
  } else if (getHandValue(playerHand) > getHandValue(dealerHand)) {
      console.log("You win!");
  //Dealer's hand is more than player's, Dealer wins
  } else if (getHandValue(playerHand) < getHandValue(dealerHand)) {
    console.log("Dealer wins.");
  } else {
    console.log("It's a tie!");
  }

  //closes the input stream of the 'readline' module and exits program.
  rl.close();
}

//Calls the main method.
playBlackjack();
