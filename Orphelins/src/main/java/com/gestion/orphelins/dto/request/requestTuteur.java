package com.gestion.orphelins.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class requestTuteur {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "Le CIN est obligatoire")
    private String cin;

    @Email(message = "Format d'email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @Pattern(regexp = "^(0|\\+212)[5-7][0-9]{8}$", 
            message = "Le numéro de téléphone doit être au format marocain (ex: 0612345678 ou +212612345678)")
    @NotBlank(message = "Le numéro de téléphone est obligatoire")
    private String telephone;

    @NotBlank(message = "La relation est obligatoire")
    @Size(max = 255, message = "La relation ne doit pas dépasser 255 caractères")
    private String relation;
}
