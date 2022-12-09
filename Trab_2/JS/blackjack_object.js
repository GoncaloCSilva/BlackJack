// pcm 20172018a Blackjack object

//constante com o número máximo de pontos para blackJack
const MAX_POINTS = 21;

// Classe Card -> This was added to be easier for building a deck
class Card{
    constructor (suit,value){
        this.suit = suit
        this.value = value
    }

    get color() {
        return this.suit === "♣" || this.suit === "♠" ? 'black' : 'red'
    }

    getHTML() {
        const cardDiv = document.createElement('div')
        cardDiv.innerText = this.suit
        cardDiv.classList.add("card", this.color)
        cardDiv.dataset.value = `${this.value} ${this.suit}`
        return cardDiv
    }
}

// Classe BlackJack - construtor
class BlackJack {
    constructor() {
        // array com as cartas do dealer
        this.dealer_cards = [];
        // array com as cartas do player
        this.player_cards = [];
        // variável booleana que indica a vez do dealer jogar até ao fim
        this.dealerTurn = false;

        // objeto na forma literal com o estado do jogo
        this.state = {
            'gameEnded': false,
            'dealerWon': false,
            'playerBusted': false
        };

        //métodos utilizados no construtor (DEVEM SER IMPLEMENTADOS PELOS ALUNOS)
        const SUITS = ["♠", "♥", "♦", "♣"]
        const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]


        this.new_deck = function () {

           // const SUITS = 4;
           // const CARDS_PER_SUIT=13;

            let deck=[];
            let j=0;

            for(let i = 0; i<=VALUES.length*SUITS.length ;i++){

                deck[i]= new Card( SUITS[j] , VALUES[(i % VALUES.length) ]);

                if(i%VALUES.length == 0 && i>=13 )j++; 
            }
            return deck;
        };

        this.shuffle = function (deck) {
            let shuffled_deck = [];
            let indexes = [];
            let index = null;
            for (let i = 0; i < deck.length; i++) {
                indexes.push(i);
            }
            for (let i = 0; i < deck.length; i++) {
                index = Math.floor(Math.random() * indexes.length);
                shuffled_deck.push(deck[indexes[index]]);
                indexes.splice(index, 1);
            }
            return shuffled_deck;
        };
        

        // baralho de cartas baralhado
        this.deck = this.shuffle(this.new_deck());
        //this.deck = this.new_deck();
    }

    // métodos
    // devolve as cartas do dealer num novo array (splice)
    get_dealer_cards() {
        return this.dealer_cards.slice();
    }

    // devolve as cartas do player num novo array (splice)
    get_player_cards() {
        return this.player_cards.slice();
    }

    // Ativa a variável booleana "dealerTurn"
    setDealerTurn (val) {
        this.dealerTurn = val;
    }

    //MÉTODOS QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
    get_cards_value(cards) { 
        if(cards.length==0) return 0
        let noAces = cards.filter(function (card){ return card.value!="A";}) //it!=1 ???     
        let figTrans=noAces.map(function(c){ return (c.value=="J"|| c.value=="Q" ||c.value=="K")?10:parseInt(c.value);}); //it>10?10:c
        let sum=figTrans.reduce(function(sum,value){ return sum+=value},0);
        let numAces= cards.length - noAces.length;
            
        while(numAces>0){
            if(sum + 11 > MAX_POINTS) 
            return sum + numAces;
            sum +=11;
            numAces-=1;
        }
        return sum + numAces;
    }

    dealer_move() {
        
        let card = this.deck[0];
        this.deck.splice(0,1);
        if(this.dealer_cards.length == 1){
            dealcard=card;
            this-this.dealer_cards.push(new Card("X","X"));         
        }
        else this-this.dealer_cards.push(card);
        return this.get_game_state();
    }

    dealer_switch(){
        if(this.dealer_cards.length = 2){
            this.dealer_cards[1] = dealcard;         
        }
    }

    player_move() {
        
        let card = this.deck[0];
        this.deck.splice(0,1);
        this-this.player_cards.push(card);
        return this.get_game_state();
    }

    house_move(){
    this.deck.splice(0,1);
    }

    get_game_state() {
        
        let playerPoints = this.get_cards_value(this.player_cards);
        let dealerPoints = this.get_cards_value(this.dealer_cards);
        let playerBusted = playerPoints > MAX_POINTS;
        let playerWon = playerPoints === MAX_POINTS;
        let dealerBusted = this.dealerTurn && (dealerPoints > MAX_POINTS);
        let dealerWon = this.dealerTurn && dealerPoints > playerPoints && dealerPoints <= MAX_POINTS; 
        this.state.gameEnded = playerBusted || playerWon || dealerBusted || dealerWon;
        this.state.dealerWon = dealerWon;
        this.state.playerBusted = playerBusted;

        return this.state;
    }
}