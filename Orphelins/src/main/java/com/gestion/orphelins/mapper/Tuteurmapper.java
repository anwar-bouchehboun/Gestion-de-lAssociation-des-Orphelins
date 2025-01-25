package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestTuteur;
import com.gestion.orphelins.dto.response.responseTuteur;
import com.gestion.orphelins.entity.Tuteur;

import java.util.stream.Collectors;
import java.util.ArrayList;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class Tuteurmapper {
    private final Orphelinmapper orphelinMapper;

    public Tuteur toEntity(requestTuteur request) {
        return Tuteur.builder()
                .nom(request.getNom())
                .email(request.getEmail())
                .telephone(request.getTelephone())
                .relation(request.getRelation())
                .orphelins(new ArrayList<>())
                .build();
    }

    public responseTuteur toResponse(Tuteur tuteur) {
        return responseTuteur.builder()
                .id(tuteur.getId())
                .nom(tuteur.getNom())
                .email(tuteur.getEmail())
                .telephone(tuteur.getTelephone())
                .relation(tuteur.getRelation())
                .orphelins(tuteur.getOrphelins() != null ? tuteur.getOrphelins().stream()
                        .map(orphelinMapper::toResponse)
                        .collect(Collectors.toList()) : new ArrayList<>())
                .build();
    }
}
