package com.rohit.sketchy_io.controller;

import java.util.List;
import java.util.Queue;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rohit.sketchy_io.entity.Player;
import com.rohit.sketchy_io.service.RoomService;

@RestController
@RequestMapping("/room")
public class RoomController {

    private RoomService roomService;

    RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<List<Player>> getPlayersOfRoom(@PathVariable String roomId) {
        List<Player> players = roomService.getPlayersOfRoom(roomId);
        return ResponseEntity.ok(players);
    }

    @PostMapping("/{roomId}")
    public ResponseEntity<Void> addPlayerToRoom(@PathVariable String roomId, @RequestBody Player player) {
        Boolean playerAdded = roomService.addPlayer(roomId, player.getUsername());
        if (playerAdded) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> removePlayerFromRoom(@PathVariable String roomId, @RequestBody String username) {
        roomService.removePlayer(roomId, username);
        return ResponseEntity.ok().build();
    }

}
