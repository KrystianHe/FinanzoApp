package com.app.wydatki.repository;

import com.app.wydatki.model.ChatMessage;
import com.app.wydatki.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByUserOrderByTimestampDesc(User user);
} 