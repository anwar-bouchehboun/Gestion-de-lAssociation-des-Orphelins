package com.gestion.orphelins.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class requestOrphelin {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Min(value = 0, message = "L'âge doit être positif")
    @Max(value = 18, message = "L'âge doit être inférieur ou égal à 18 ans")
    @NotNull(message = "L'âge est obligatoire")
    private int age;

    @Pattern(regexp = "^(Masculin|Feminin)$", message = "Le genre doit être 'Masculin' ou 'Féminin'")
    @NotBlank(message = "Le genre est obligatoire")
    private String genre;

    @NotBlank(message = "L'état de santé est obligatoire")
    private String etatDeSante;

    @NotBlank(message = "Le niveau d'éducation est obligatoire")
    private String niveauEducation;

    @NotNull(message = "L'ID du tuteur est obligatoire")
    private Long tuteurId;
}
