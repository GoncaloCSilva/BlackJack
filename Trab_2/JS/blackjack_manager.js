// pcm 20172018a Blackjack oop

let game = null;
let dealcard=null;

function debug(an_object) {
    document.getElementById("debug").innerHTML = JSON.stringify(an_object);
}

function buttons_initialization(){
    document.getElementById("card").disabled     = false;
    document.getElementById("stand").disabled     = false;
    document.getElementById("new_game").disabled = true;
}
function debugAll(){
    debug(game);
    document.getElementById("pdebug").innerHTML = JSON.stringify(game.get_cards_value(game.get_player_cards()));  //Player Debug
    document.getElementById("ddebug").innerHTML = JSON.stringify(game.get_cards_value(game.get_dealer_cards()));  //Dealer Debug
}

function log(log_info) {
    document.getElementById("log_info").innerHTML = JSON.stringify(log_info);
}

function finalize_buttons(){
    document.getElementById("card").disabled     = true;
    document.getElementById("stand").disabled     = true;
    document.getElementById("new_game").disabled = false;
}

function clear_Display(id){
    if(id == 1)document.querySelector('.player-card-slot').innerHTML = ""
    else  document.querySelector('.dealer-card-slot').innerHTML = ""
}

//FUNÇÕES QUE DEVEM SER IMPLEMENTADOS PELOS ALUNOS
function new_game(){
    document.querySelector('.dealer-card-slot').innerHTML = ""
    document.querySelector('.player-card-slot').innerHTML = ""

    game = new BlackJack();
    buttons_initialization();
    debug(game);
    dealer_new_card();
    player_new_card();
    house_take_card();
    dealer_new_card();
    player_new_card();
    
    let dealerCards = game.get_dealer_cards();
    let playerCards = game.get_player_cards();
    showDealerDeck(dealerCards);
    showPlayerDeck(playerCards);

    
    debugAll();
  // debug(game.get_cards_value([7,3,1,1]));
}

function update_dealer(state){
    let msg = "Dealer"
    if(state.dealerWon){
        msg = msg + " won";
        log(msg);
        finalize_buttons();
        return state
    }else if(game.get_cards_value(game.get_dealer_cards()) > 21) {
        msg = msg + " busted";
        log(msg);
        state.gameEnded = true;
        finalize_buttons();
        return state
    } else {
        msg = msg + " drawing...";
        log(msg);
        return state
    }
}

function update_player(state){
    let msg = "Player"
        if(game.get_cards_value(game.get_player_cards()) == 21) {
            msg = msg + " won";
            log(msg);
            state.gameEnded = true;
            finalize_buttons();
            return state;
        }else if(game.get_cards_value(game.get_player_cards()) > 21) {
            msg = msg + " busted";
            log(msg);
            state.gameEnded = true;
            state.playerBusted=true;
            finalize_buttons();
            return state;
        } else {
            msg = msg + " drawing...";
            log(msg);
            return state;
        }
        
}

function dealer_new_card(){
    let state = game.get_game_state();
    if(!state.gameEnded) {
        game.dealer_move();
        state = gameEnd(state);
        state = update_dealer(state);
        debugAll();
        return state;
    }
    debugAll();
    return state;
}

function player_new_card(){
    let state = game.get_game_state();
    if(!state.gameEnded && !game.dealerTurn) {
            game.player_move();
            state = gameEnd(state);
            state = update_player(state);
            let playerCards = game.get_player_cards();
            if(playerCards.length > 2) {
                clear_Display(1);
                showPlayerDeck(playerCards);
            }
            debugAll();
            return state;
    }
    debugAll();
    return state;
}

function house_take_card(){
    game.house_move();
}

function gameEnd(state){
    let playcards=game.get_player_cards();
    let dealcards=game.get_dealer_cards();
    let playvalue=game.get_cards_value(playcards);
    let dealvalue=game.get_cards_value(dealcards);
    
    if(playvalue == 21 || dealvalue > 21) state.gameEnded=true;
    else if(playvalue > 21) {
        state.gameEnded=true;
        state.dealerWon=true;
        state.playerBusted=true;
    }
    else if(dealvalue==21) {
        state.gameEnded=true;
        state.dealerWon=true;
    }
    else if(playvalue<dealvalue && game.dealerTurn){ 
         state.gameEnded=true;
         state.dealerWon=true;
    }
    
    return state;
}

function dealer_finish(){
    let state = game.get_game_state();
    if(!state.gameEnded){
        if(!game.dealerTurn){ 
            game.dealer_switch();
            game.setDealerTurn(true);
        }
        else dealer_new_card();
        
    }
    let dealerCards = game.get_dealer_cards();
        if(dealerCards.length > 1) {
            clear_Display(0);
            showDealerDeck(dealerCards);
        }
      debugAll();
      state = gameEnd(state);
      state = update_dealer(state);
      debugAll();
  
} 

function showDealerDeck(dealerDeck){
    dealerDeck.forEach(element => {
        document.getElementById("dealer-cards").appendChild(element.getHTML());
    });

}

function showPlayerDeck(playerDeck){
    playerDeck.forEach(element => {
        document.getElementById("player-cards").appendChild(element.getHTML());
    });
}