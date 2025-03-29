package com.rohit.sketchy_io.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.rohit.sketchy_io.controller.ChatMessage;
import com.rohit.sketchy_io.entity.Player;
import com.rohit.sketchy_io.entity.RoomData;

@Service
public class RoomService {
    private Map<String, RoomData> rooms = new HashMap<>();

    public Boolean addPlayer(String roomId, String username) {
        return rooms.computeIfAbsent(roomId, k -> new RoomData()).addPlayer(new Player(username));
    }

    public void removePlayer(String roomId, String username) {
        List<Player> playerList = rooms.get(roomId).getPlayerList();
        if (playerList != null) {
            playerList.removeIf(player -> player.getUsername().equals(username));
            if (playerList.isEmpty()) {
                rooms.remove(roomId);
            }
        }
    }

    private Player getPlayerWithUsername(String roomId, String username) {
        List<Player> playerList = rooms.get(roomId).getPlayerList();
        if (playerList != null) {
            for (Player player : playerList) {
                if (player.getUsername().equals(username)) {
                    return player;
                }
            }
        }
        return null;
    }

    public Player nextPlayerToDraw(String roomId) {
        RoomData roomData = rooms.get(roomId);
        if (roomData != null) {
            return roomData.getNextPlayer();
        }
        return null;
    }


    public List<Player> getPlayersOfRoom(String roomId) {
        return rooms.getOrDefault(roomId, new RoomData()).getPlayerList();
    }

    public Set<String> getRoomIds() {
        return rooms.keySet();
    }

    public boolean checkGuess(String roomId, ChatMessage chatMessage) {
        RoomData roomData = rooms.get(roomId);
        Player player = getPlayerWithUsername(roomId, chatMessage.getSender());
        if (roomData != null) {
            return roomData.checkGuess(chatMessage.getContent() , player);
        }
        return false;
    }

    public void setWordToRoom(String roomId, String word) {
        RoomData roomData = rooms.get(roomId);
        if (roomData != null) {
            roomData.setWordToGuess(word);
        }
    }

}
