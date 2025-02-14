package com.gestion.orphelins.controller;

import com.gestion.orphelins.dto.request.requestUser;
import com.gestion.orphelins.dto.response.responseUser;
import com.gestion.orphelins.services.interfaces.UserInterface;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import javax.validation.Valid;


@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserInterface userInterface;


    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<responseUser> createUser(@Valid @RequestBody requestUser request) {
        log.info("Tentative de création d'utilisateur avec email: {}", request.getEmail());
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            log.info("Utilisateur authentifié: {}", auth.getName());
            log.info("Autorités de l'utilisateur: {}", auth.getAuthorities());
        } else {
            log.warn("Aucune authentification trouvée");
        }
        return ResponseEntity.ok(userInterface.createUser(request));
    }



    @GetMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<responseUser> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userInterface.getUserById(id));
    }

    @PutMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<responseUser> updateUser(@PathVariable Long id, @RequestBody requestUser request) {
        return ResponseEntity.ok(userInterface.updateUser(id, request));
    }

    @DeleteMapping("/user/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userInterface.deleteUser(id);
        return ResponseEntity.ok("Utilisateur supprimé avec succès");
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userInterface.getAllUsers());
    }
}
