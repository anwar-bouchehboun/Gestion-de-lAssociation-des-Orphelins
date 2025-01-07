package com.gestion.orphelins.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import javax.persistence.Table;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dons")
public class Don {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le nom du donateur est obligatoire")
    private String nomDonateur;

    @Column(nullable = false)
    @NotNull(message = "Le montant est obligatoire")
    @Positive(message = "Le montant doit être positif")
    private double montant;

    @Column(nullable = false)
    @NotBlank(message = "L'objectif est obligatoire")
    private String objectif;

    @Column(nullable = false)
    @NotNull(message = "La date est obligatoire")
    @JsonFormat(pattern = "yyyy-MM-dd")
      private LocalDate date;

  

}
