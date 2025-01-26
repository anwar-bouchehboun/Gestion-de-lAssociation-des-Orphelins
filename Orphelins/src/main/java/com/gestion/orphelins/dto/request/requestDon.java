package com.gestion.orphelins.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class requestDon {
    @NotBlank(message = "Le nom du donateur est obligatoire")
    private String nomDonateur;

    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private double montant;

    @NotBlank(message = "L'objectif est obligatoire")
    private String objectif;

    @NotNull(message = "Le statut est obligatoire")
    private String statut;

}
