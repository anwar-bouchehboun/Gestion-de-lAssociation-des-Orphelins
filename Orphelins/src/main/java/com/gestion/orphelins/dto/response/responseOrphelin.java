package com.gestion.orphelins.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class responseOrphelin {
    private Long id;
    private String nom;
    private int age;
    private String genre;
    private String etatDeSante;
    private String niveauEducation;
    private String nomTuteur;
    private String relation;
}
