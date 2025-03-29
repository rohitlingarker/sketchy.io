package com.rohit.sketchy_io.controller;

import java.util.List;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import com.rohit.sketchy_io.entity.Player;
import com.rohit.sketchy_io.service.RoomService;
import com.rohit.sketchy_io.service.WordService;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
public class DrawController {
    private RoomService roomService;
    private WordService wordService;

    DrawController(RoomService roomService, WordService wordService) {
        this.roomService = roomService;
        this.wordService = wordService;
    }

    @MessageMapping("/draw.startPath/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage startPath(
            @DestinationVariable String roomId,
            @Payload DrawMessage position) {
        // System.out.println(position);
        return position;
    }

    @MessageMapping("/draw.pathPoint/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage pathPoint(
            @DestinationVariable String roomId,
            @Payload DrawMessage position) {
        return position;
    }

    @MessageMapping("/draw.clear/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage clearCanvas(
            @DestinationVariable String roomId,
            @Payload DrawMessage drawMessage) {
        return drawMessage;
    }

    @MessageMapping("/draw.color/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage changeColor(
            @DestinationVariable String roomId,
            @Payload DrawMessage drawMessage) {
        return drawMessage;
    }

    @MessageMapping("/draw.lineWidth/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage changeLineWidth(
            @DestinationVariable String roomId,
            @Payload DrawMessage drawMessage) {
        return drawMessage;
    }

    @MessageMapping("/draw.endTurn/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage endTurn(
            @DestinationVariable String roomId,
            @Payload DrawMessage drawMessage) {
        Player nextPlayer = roomService.nextPlayerToDraw(roomId);
        List<String> words = wordService.get3Words();
        DrawMessage drawMessage1;
        if (nextPlayer != null) {
            drawMessage1 = DrawMessage.builder()
                    .player(nextPlayer)
                    .words(words)
                    .type(DrawMessageType.END_TURN)
                    .build();
        } else {
            drawMessage1 = DrawMessage.builder()
                    .type(DrawMessageType.END_GAME)
                    .build();
        }
        return drawMessage1;
    }

    @MessageMapping("/draw.wordChoice/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage wordChoice(
            @DestinationVariable String roomId,
            @Payload DrawMessage drawMessage) {
        String word = drawMessage.getWords().get(0);
        roomService.setWordToRoom(roomId, word);

        return DrawMessage.builder()
                .x(word.length())
                .type(DrawMessageType.WORD_CHOICE)
                .words(List.of(word))
                .build();
    }
}