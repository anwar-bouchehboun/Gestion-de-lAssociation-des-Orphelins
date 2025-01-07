package com.gestion.orphelins.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.JoinColumn;
import javax.validation.constraints.Min;
import javax.validation.constraints.Max;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.persistence.Table;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "orphelins")
public class Orphelin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Column(nullable = false)
    @Min(value = 0, message = "L'âge doit être positif")
    @Max(value = 18, message = "L'âge doit être inférieur ou égal à 18 ans")
    @NotNull(message = "L'âge est obligatoire")
    private int age;

    @Column(nullable = false)
    @Pattern(regexp = "^(Masculin|Feminin)$", message = "Le genre doit être 'Masculin' ou 'Féminin'")
    @NotBlank(message = "Le genre est obligatoire")
    private String genre;

    @Column(nullable = false)
    @NotBlank(message = "L'état de santé est obligatoire")
    private String etatDeSante;

    @Column(nullable = false)
    @NotBlank(message = "Le niveau d'éducation est obligatoire")
    private String niveauEducation;

    @ManyToOne
    @JoinColumn(name = "tuteur_id")
    @NotNull(message = "Le tuteur est obligatoire")
    private Tuteur tuteur;
}
