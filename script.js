console.log("script is linked")

$(document).ready(function(){

	var bankBalance = 1337;
	var playerHand = [];
	var dealerHand = [];
	var gameActive = false;
	var betAmount = 0
	function gameEnd(){
		gameActive = false
		$('.gameActive').hide();
		$('.gameInactive').show();
	};
	function playerLose(){
		gameEnd();
		var audio = new Audio("http://www.richmolnar.com/Sounds/Homer%20-%20D'oh!%20(1).wav");
		audio.play()
		setTimeout(function(){
			alert("You lose")
		},500)
		
	};
	function playerWin(){
		gameEnd();
			bankBalance += betAmount * 2;
			$('#balance').val(bankBalance)
			var audio = new Audio("http://www.richmolnar.com/Sounds/Homer%20-%20Mmmm,%20donuts%20(1).wav");
			audio.play()
			setTimeout(function(){
			alert("You Win")
		},500)
			
			
	};
	function playerTie(){
		gameEnd();
		alert("Tied")
			bankBalance += betAmount;
			$('#balance').val(bankBalance)

	};

	$('#balance').val(bankBalance)

	//var placeBet is to automatically remove the bet amount from bankroll
	var Card = function Card(suit, value){
		this.suit = suit;
		this.value = value;
		this.blackJackValue = function(){
			return Math.min(10, this.value);
		};
		this.toString = function(){
			var output = "";
			switch(this.value){
				case 1: 
				output = "Ace";
				break;
				case 11:
				output = "Jack";
				break;
				case 12:
				output = "Queen";
				break;
				case 13:
				output = "King";
				break;
				default: 
				output = this.value;
				break;
			}
			output += " of ";
			switch(this.suit){
				case 0:
				output += "Diamonds";
				break;
				case 1:
				output += "Clubs";
				break;
				case 2:
				output += "Hearts";
				break;
				case 3:
				output += "Spades";
				break;
			};
			return output;

		};
	};
	function shuffle(array) {
	    var counter = array.length, temp, index;

	    // While there are elements in the array
	    while (counter > 0) {
	        // Pick a random index
	        index = Math.floor(Math.random() * counter);

	        // Decrease counter by 1
	        counter--;

	        // And swap the last element with it
	        temp = array[counter];
	        array[counter] = array[index];
	        array[index] = temp;
	    }

	    return array;
	}
	var deck = [];
	var createDeck = function(){
		deck = [];
		for (var i = 1; i <= 13; i++){
			for (var j = 0; j < 4; j++){
				var card = new Card(j, i);
				deck.push(card);
				// console.log(card, card.blackJackValue(),card.toString())
			}	
				
		}
		deck = shuffle(deck);
	}
	
	function printDeck(){
		for(var i = 0; i < deck.length; i++){
			console.log(deck[i].toString())
		}
	};
	function drawCard(hand){
		var card = deck.pop();
		hand.push(card);
	}
	function handValue(hand){
		var aceCount = 0
		var highValue = 0
		var lowValue = 0
		for (var i = 0; i < hand.length; i++){
			var card = hand[i];
			var value = card.blackJackValue();
			//this is to check if its an ACE
			if (value == 1){
				highValue += 11;
				aceCount ++;
			} else{
				highValue += value
			}
			lowValue += value

		}
		if (highValue > 21){
			//if theres more than one ACE
			if (aceCount >= 2 && lowValue + 10 <= 21){
				return lowValue + 10;
			}
			
			return lowValue;
		} else {
			return highValue;
		}
	};
	
	function hit(hand, player){
		var value = handValue(hand)
		if(value < 21){
			drawCard(hand);
			showHands();
			value = handValue(hand)
			if (value > 21){
				if (player)
					playerLose();
			}
		} else 
		alert("You cant hit anymore")
	}
	function stand(){
		console.log("stand")
		var dealerValue = handValue(dealerHand);
		while(dealerValue < 17){
			hit(dealerHand, false);
			dealerValue = handValue(dealerHand);
		}
		showHands();
		var playerValue = handValue(playerHand);
		if (dealerValue > 21){
			playerWin(); 
		} else if (playerValue > dealerValue && dealerValue < 21)
		playerWin();
		else if (playerValue === dealerValue){
			playerTie();
		} else {
			playerLose();
		}
	};
	function showHand(hand, element){
		var markUp = ""
		for (var i = 0; i < hand.length; i++){
			var card = hand[i];
			markUp += card.toString()+ "<br>";
		}
		element.html(markUp);
	};
	function showHands(){
		showHand(playerHand, $('#player-hand'));
		showHand(dealerHand, $('#dealer-hand'));
		var dealerValue = handValue(dealerHand);
		var playerValue = handValue(playerHand);
		$('#player-hand-value').text(playerValue)
		$('#dealer-hand-value').text(dealerValue)
	};
	function startGame(){
		createDeck();
		// printDeck();
		playerHand = [];
		dealerHand = [];
		drawCard(playerHand);
		drawCard(playerHand);
		drawCard(dealerHand);
		showHands();
		var playerValue = handValue(playerHand);
		if (playerValue == 21){
			playerWin();
			return;
		}
		gameActive = true;
		$('.gameActive').show();
		$('.gameInactive').hide();

	};
	var placeBet = function(bet){
		betAmount = bet
		if (bankBalance >= betAmount){
			bankBalance = bankBalance - betAmount;
			$('#balance').val(bankBalance)
			startGame();
		} else {
			alert("You aint bet any donuts")
		}

	}
	$('#bet').click(function(){

		console.log("Betting connected");
		var getBetAmount =parseInt($('#bet-amount').val())
		placeBet(getBetAmount);
		
	});
	$('#hit').click(function(){
		hit(playerHand, true)
	});
	$('#stand').click(function(){
		stand()
	});
	gameEnd();
});

