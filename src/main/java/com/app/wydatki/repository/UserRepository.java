package com.app.wydatki.repository;


import com.app.wydatki.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE LOWER(u.login) = LOWER(:login)")
    Optional<User> getUserByLogin(@Param("login") String login);

    @Query("SELECT u FROM User u")
    List<User> getAllUsers();
}
