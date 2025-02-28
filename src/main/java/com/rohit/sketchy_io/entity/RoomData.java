package com.rohit.sketchy_io.entity;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.rohit.sketchy_io.service.WordService;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomData {
    private int totalNumberOfRounds;
    private int maxNoOfPlayersInRoom;
    private int currentPlayer;
    private int currentRound;
    private List<Player> playerList;
    private String wordToGuess ;

    @Autowired
    private WordService wordService;

    public RoomData() {
        playerList = new ArrayList<>();
        totalNumberOfRounds = 3;
        maxNoOfPlayersInRoom = 7;
        currentPlayer = 0;
    }

    public Boolean addPlayer(Player player) {
        return playerList.add(player);
    }

    public Player getNextPlayer() {
        if (currentPlayer < playerList.size()) {
            Player nextPlayer = playerList.get(currentPlayer);
            currentPlayer++;
            for (Player player : playerList) {
                player.setHasGuessed(false);
            }
            return nextPlayer;
        }else{
            return endRound();
        }
    }

    private Player endRound() {
        if (currentRound == totalNumberOfRounds) {
            endGame();
            return null;
        }
        
        currentPlayer = 0;
        currentRound++;
        return this.getNextPlayer();
    }

    private void endGame() {
        // TODO: implement end game logic
    }

    public boolean checkGuess(String content, Player player ) {
        if (wordToGuess.equals(content.trim())){
            player.setHasGuessed(true);
            return true;
        }
        return false;
    }

    
}
