package com.gestion.orphelins.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class responseUser {
    private Long id;
    private String nom;
    private String email;
    private String role;
    private boolean isActive;
}