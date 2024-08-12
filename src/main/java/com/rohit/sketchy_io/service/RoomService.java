package com.rohit.sketchy_io.service;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Set;

import org.springframework.stereotype.Service;

@Service
public class RoomService {
    private Map<String, Queue<String>> rooms = new HashMap<>();

    public Boolean addPlayer(String roomId, String username) {
        return rooms.computeIfAbsent(roomId, k -> new 
        LinkedList<>()).add(username);
    }

    public void removePlayer(String roomId, String username) {
        Queue<String> players = rooms.get(roomId);
        if (players != null && players.contains(username)) {
            players.remove(username);
            if (players.isEmpty()) {
                rooms.remove(roomId);
            }
        }
    }

    public Queue<String> getPlayersOfRoom(String roomId) {
        return rooms.getOrDefault(roomId,new LinkedList<>());
    }

    public Set<String> getRoomIds(){
        return rooms.keySet();
    }
}
