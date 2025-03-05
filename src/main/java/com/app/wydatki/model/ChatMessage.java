package com.app.wydatki.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "chat_messages")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 1000)
    private String content;
    
    @Column(nullable = false)
    private boolean isUserMessage;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column
    private String context; 
    
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
} 