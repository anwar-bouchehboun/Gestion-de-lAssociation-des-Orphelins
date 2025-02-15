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
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Pageable;

import com.gestion.orphelins.dto.request.PasswordUpdateRequest;
import com.gestion.orphelins.dto.request.UserUpdateRequest;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserInterface userInterface;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@Valid @RequestBody requestUser request) {
        try {
            log.info("Tentative de création d'utilisateur avec email: {}", request.getEmail());
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null) {
                log.info("Utilisateur authentifié: {}", auth.getName());
                log.info("Autorités de l'utilisateur: {}", auth.getAuthorities());
            }

            responseUser response = userInterface.createUser(request);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "L'email " + request.getEmail() + " existe déjà");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<responseUser> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userInterface.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<responseUser> updateUser(@PathVariable Long id, @RequestBody requestUser request) {
        return ResponseEntity.ok(userInterface.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userInterface.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Utilisateur supprimé avec succès");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userInterface.getAllUsers());
    }

    @GetMapping("page")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userInterface.getAllUsers(pageable));
    }

    @PutMapping("/password/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @Valid @RequestBody PasswordUpdateRequest request) {
        try {
            log.info("Tentative de mise à jour du mot de passe pour l'utilisateur avec ID: {}", id);

            // Vérification de la correspondance des mots de passe
            if (!request.getMotDePasse().equals(request.getConfirmPassword())) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("message", "Les mots de passe ne correspondent pas le confirmation");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
            }

            userInterface.updatePassword(id, request);
            Map<String, String> response = new HashMap<>();
            response.put("status", "success");
            response.put("message", "Mot de passe mis à jour avec succès");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", "Erreur lors de la mise à jour du mot de passe: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }

    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<responseUser> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userInterface.updateUser(id, request));
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsersByNom(@RequestParam String nom) {
        return ResponseEntity.ok(userInterface.getAllUsersByNom(nom));
    }
}
