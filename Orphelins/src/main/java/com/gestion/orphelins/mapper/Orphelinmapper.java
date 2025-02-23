package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestOrphelin;
import com.gestion.orphelins.dto.response.responseOrphelin;
import com.gestion.orphelins.entity.Orphelin;
import com.gestion.orphelins.entity.Tuteur;
import org.springframework.stereotype.Component;

@Component
public class Orphelinmapper {

    public Orphelin toEntity(requestOrphelin request, Tuteur tuteur) {
        return Orphelin.builder()
                .nom(request.getNom())
                .age(request.getAge())
                .genre(request.getGenre())
                .etatDeSante(request.getEtatDeSante())
                .niveauEducation(request.getNiveauEducation())
                .tuteur(tuteur)
                .build();
    }

    public responseOrphelin toResponse(Orphelin orphelin) {
        return responseOrphelin.builder()
                .id(orphelin.getId())
                .nom(orphelin.getNom())
                .age(orphelin.getAge())
                .genre(orphelin.getGenre())
                .etatDeSante(orphelin.getEtatDeSante())
                .niveauEducation(orphelin.getNiveauEducation())
                .nomTuteur(orphelin.getTuteur().getNom())
                .relation(orphelin.getTuteur().getRelation())
                .tuteurId(orphelin.getTuteur().getId())
                .build();
    }
}
