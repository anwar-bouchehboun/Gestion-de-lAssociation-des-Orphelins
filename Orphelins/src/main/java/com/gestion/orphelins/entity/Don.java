package com.gestion.orphelins.entity;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
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
import lombok.Builder;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.gestion.orphelins.enums.Statut;

import java.time.LocalDate;
import javax.persistence.Table;
import javax.persistence.PreUpdate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
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
  @Builder.Default
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dateCreation = LocalDate.now();

  @Column(nullable = true)
  private LocalDate dateModification;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Statut statut;

  @PreUpdate
  protected void onUpdate() {
    dateModification = LocalDate.now();
  }
}
