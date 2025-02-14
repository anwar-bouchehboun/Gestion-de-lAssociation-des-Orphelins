package com.gestion.orphelins.controller;

import com.gestion.orphelins.dto.request.AuthRequest;
import com.gestion.orphelins.entity.User;
import com.gestion.orphelins.repository.UserRepository;
import com.gestion.orphelins.services.implementation.TokenBlacklistService;
import com.gestion.orphelins.utilitaire.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final TokenBlacklistService tokenBlacklist;


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> authenticateAndGetToken(@Valid @RequestBody AuthRequest authRequest) {
        try {
            // Vérifier si l'utilisateur existe
            User user = userRepository.findByEmail(authRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé Sur Application"));

            // Vérifier si l'utilisateur est actif
            if (!user.isActive()) {
                Map<String, String> errorResponse = new HashMap<>();
                errorResponse.put("message", "Compte utilisateur inactif");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            if (authentication.isAuthenticated()) {
                String token = jwtUtil.generateToken(user.getNom(), user.getEmail(), user.getRole());

                Map<String, String> response = new HashMap<>();
                response.put("token", token);
                response.put("role", user.getRole().name());
                response.put("message", "Authentification réussie");
                return ResponseEntity.ok(response);
            }

            throw new RuntimeException("Authentification invalide");

        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "Email ou mot de passe incorrect");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklist.addToBlacklist(token);
            return ResponseEntity.ok("Déconnexion réussie");
        }

        return ResponseEntity.badRequest().body("Token non fourni");
    }
}
