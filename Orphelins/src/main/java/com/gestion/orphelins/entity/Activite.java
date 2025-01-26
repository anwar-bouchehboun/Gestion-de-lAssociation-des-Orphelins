package com.gestion.orphelins.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.JoinTable;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.NotBlank;
import java.util.*;
import javax.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonFormat;
import javax.validation.constraints.Positive;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "activites")
public class Activite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Column(nullable = false)
    @NotBlank(message = "La description est obligatoire")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "La date est obligatoire")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(nullable = false)
    @NotNull(message = "Le budget est obligatoire")
    @Positive(message = "Le budget doit être positif")
    private double budget;

    @ManyToMany
    @JoinTable(name = "activite_orphelin", joinColumns = @JoinColumn(name = "activite_id"), inverseJoinColumns = @JoinColumn(name = "orphelin_id"))
    @Builder.Default
    private Set<Orphelin> participants = new HashSet<>();

}
