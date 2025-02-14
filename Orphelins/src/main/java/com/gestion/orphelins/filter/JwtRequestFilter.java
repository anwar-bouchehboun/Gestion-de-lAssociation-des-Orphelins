package com.gestion.orphelins.filter;

import com.gestion.orphelins.services.implementation.AuthenticationService;
import com.gestion.orphelins.utilitaire.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@Slf4j
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    @Qualifier("AuthenticationService")
    private final AuthenticationService authenticationService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        log.info("Processing request to: {}", request.getRequestURI());

        String authHeader = request.getHeader("Authorization");
        log.debug("Authorization header: {}", authHeader);

        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtUtil.extractSubject(token);
                log.info("Token trouvé pour l'utilisateur: {}", username);
                log.info("Rôle de l'utilisateur: {}", jwtUtil.extractRole(token));
            } catch (Exception e) {
                log.error("Erreur lors de l'extraction du token: {}", e.getMessage());
            }
        } else {
            log.warn("Pas de token Bearer trouvé dans l'en-tête");
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = authenticationService.loadUserByUsername(username);
            log.info("Rôles de l'utilisateur depuis UserDetails: {}", userDetails.getAuthorities());

            if (jwtUtil.validateToken(token, username)) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.info("Authentification réussie pour l'utilisateur: {}", username);
            } else {
                log.warn("Token invalide pour l'utilisateur: {}", username);
            }
        }

        filterChain.doFilter(request, response);
    }
}
