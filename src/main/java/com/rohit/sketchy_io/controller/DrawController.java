package com.rohit.sketchy_io.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class DrawController {

    @MessageMapping("/draw.startPath/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage startPath(
        @DestinationVariable String roomId,
        @Payload DrawMessage position
    ) {
        // System.out.println(position);
        return position;
    }

    @MessageMapping("/draw.pathPoint/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage pathPoint(
        @DestinationVariable String roomId,
        @Payload DrawMessage position
    ) {
        return position;
    }

    @MessageMapping("/draw.clear/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage clearCanvas(
        @DestinationVariable String roomId,
        @Payload DrawMessage drawMessage
    ) {
        return drawMessage;
    }

    @MessageMapping("/draw.color/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage changeColor(
        @DestinationVariable String roomId,
        @Payload DrawMessage drawMessage
    ) {
        return drawMessage;
    }

    @MessageMapping("/draw.lineWidth/{roomId}")
    @SendTo("/topic/drawingBoard/{roomId}")
    public DrawMessage changeLineWidth(
        @DestinationVariable String roomId,
        @Payload DrawMessage drawMessage
    ) {
        return drawMessage;
    }
}