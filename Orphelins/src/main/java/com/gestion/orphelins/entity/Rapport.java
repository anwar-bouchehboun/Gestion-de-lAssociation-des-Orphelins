package com.gestion.orphelins.entity;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "rapports")
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Le type est obligatoire")
    private String type;

    @Column(nullable = false, length = 10000)
    @NotBlank(message = "Le contenu ne peut pas être vide")
    private String contenu;

    @Column(nullable = false, length = 10000)
    @NotBlank(message = "Le description ne peut pas être vide")
    private String description;

    @Column(nullable = false)
    @NotNull(message = "La date est obligatoire")
    @PastOrPresent(message = "La date ne peut pas être dans le futur")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @Column(nullable = true)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateModification;
    @PreUpdate
    protected void onUpdate() {
        dateModification = LocalDate.now();
    }
}
