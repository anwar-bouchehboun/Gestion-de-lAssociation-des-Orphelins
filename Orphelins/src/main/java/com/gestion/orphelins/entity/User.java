package com.gestion.orphelins.entity;

import com.gestion.orphelins.enums.Roleenum;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Column;
import javax.persistence.Enumerated;
import javax.persistence.EnumType;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.validation.constraints.Pattern;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Column(nullable = false, unique = true)
    @Email(message = "L'email est invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    @Pattern(regexp = "^[a-zA-Z0-9@]{8,}$", message = "Le mot de passe doit contenir des lettres, chiffres et peut inclure le caractère @")
    // "User#2023" , "Admin@123"
    private String motDePasse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Roleenum role;

    @Column(nullable = false)
    private boolean isActive = false;
}
