package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestUser;
import com.gestion.orphelins.dto.response.responseUser;
import com.gestion.orphelins.entity.User;
import com.gestion.orphelins.enums.Roleenum;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import com.gestion.orphelins.dto.request.UserUpdateRequest;
import com.gestion.orphelins.dto.request.PasswordUpdateRequest;

@Component
@RequiredArgsConstructor
public class Usermapper {

    private final PasswordEncoder passwordEncoder;

    public User toEntity(requestUser request) {
        return User.builder()
                .nom(request.getNom().toUpperCase())
                .email(request.getEmail())
                .motDePasse(passwordEncoder.encode(request.getMotDePasse()))
                .role(Roleenum.valueOf(request.getRole()))
                .isActive(request.isActive())
                .build();
    }

  

    public User toEntityupdate(UserUpdateRequest request) {
        return User.builder()
                .nom(request.getNom().toUpperCase())
                .email(request.getEmail())
                .role(Roleenum.valueOf(request.getRole()))
                .build();
    }



    public responseUser toResponse(User user) {
        return responseUser.builder()
                .id(user.getId())
                .nom(user.getNom())
                .email(user.getEmail())
                .role(user.getRole().name())
                .isActive(user.isActive())
                .build();
    }
}