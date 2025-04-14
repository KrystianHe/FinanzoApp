package com.app.wydatki.service.request.service;

import com.app.wydatki.enums.UserState;
import com.app.wydatki.model.User;
import com.app.wydatki.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    public UserDetailsServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("Próba logowania dla użytkownika: {}", username);
        
        Optional<User> userOptional = userRepository.getUserByEmail(username);
        
        if (userOptional.isEmpty()) {
            log.error("Użytkownik nie znaleziony: {}", username);
            throw new UsernameNotFoundException("User not found");
        }
        
        User user = userOptional.get();
        log.info("Znaleziono użytkownika: {}, status: {}, enabled: {}", user.getEmail(), user.getStatus(), user.isEnabled());
        
        // Sprawdzenie czy konto jest aktywne
        if (!user.isEnabled() || user.getStatus() != UserState.ACTIVE) {
            log.error("Użytkownik nie jest aktywny: {}, status: {}, enabled: {}", 
                username, user.getStatus(), user.isEnabled());
            throw new UsernameNotFoundException("Konto nie jest aktywne - zweryfikuj swój email");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                true,  // enabled (już sprawdziliśmy wcześniej)
                true,  // accountNonExpired
                true,  // credentialsNonExpired
                true,  // accountNonLocked
                Collections.emptyList()  // authorities
        );
    }
}

