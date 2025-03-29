package com.rohit.sketchy_io.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.rohit.sketchy_io.controller.ChatMessage;
import com.rohit.sketchy_io.controller.MessageType;
import com.rohit.sketchy_io.service.RoomService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;
    @Autowired
    private RoomService roomService;
    
    @EventListener
    public void handleWebSocoketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String userName = (String) headerAccessor.getSessionAttributes().get("username");
        String roomId = (String) headerAccessor.getSessionAttributes().get("roomId");
        if (userName!=null) {
            log.info("User disconnected:" + userName);
            roomService.removePlayer(roomId, userName);
            var chatMessage = ChatMessage.builder()
            .type(MessageType.LEAVE)
            .sender(userName)
            .build();
            messageTemplate.convertAndSend("/topic/public/"+roomId, chatMessage);
        }
    }
}
