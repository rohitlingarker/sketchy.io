package com.rohit.sketchy_io.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class DrawController {

    @MessageMapping("/draw.startPath")
    @SendTo("/topic/drawingBoard")
    public Position startPath(
        @Payload Position position
    ) {
        return position;
    }

    @MessageMapping("/draw.pathPoint")
    @SendTo("/topic/drawingBoard")
    public Position pathPoint(
        @Payload Position position
    ) {
        return position;
    }
}