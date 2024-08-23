package com.rohit.sketchy_io.entity;

import java.util.List;

public class Game {
    private int totalNumberOfRounds;
    private int totalNumberOfPlayers;
    private int maxNoOfPlayersInRoom;
    private int roundNumber;
    private int currentPlayer;
    private List<Player> playerList;



    public Player getNextPlayer(){
        if (currentPlayer == playerList.size()) {
            currentPlayer+=1;
            return playerList.get(currentPlayer);
        }
        else {
            endRound();
            return getNextPlayer();
        }
    }

    private void endRound(){
        if (roundNumber<totalNumberOfRounds) {
            roundNumber+=1; 
            currentPlayer=-1;
        }else{
            endGame();
        }
    }

    private void endGame(){
        //game over logic
    }
}
