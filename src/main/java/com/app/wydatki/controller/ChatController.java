package com.app.wydatki.controller;

import com.app.wydatki.model.ChatMessage;
import com.app.wydatki.service.ChatAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatAIService chatAIService;

    @PostMapping("/message")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestBody String message,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatAIService.processUserMessage(message, userDetails.getUsername()));
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatAIService.getUserChatHistory(userDetails.getUsername()));
    }
}

