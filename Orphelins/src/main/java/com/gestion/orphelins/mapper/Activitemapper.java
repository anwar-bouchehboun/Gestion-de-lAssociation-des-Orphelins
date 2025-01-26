package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestActivite;
import com.gestion.orphelins.dto.response.responseActivite;
import com.gestion.orphelins.dto.response.responseOrphelin;
import com.gestion.orphelins.entity.Activite;
import com.gestion.orphelins.entity.Orphelin;
import com.gestion.orphelins.repository.OrphelinRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor

public class Activitemapper {

    private OrphelinRepository orphelinRepository;

    @Autowired
    private Orphelinmapper orphelinMapper;

    public Activite toEntity(requestActivite request) {
        return Activite.builder()
                .nom(request.getNom())
                .description(request.getDescription())
                .date(request.getDate())
                .budget(request.getBudget())
                .participants(request.getParticipantsIds().stream()
                        .map(id -> orphelinRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Orphelin non trouvé: " + id)))
                        .collect(Collectors.toSet()))
                .build();
    }

    public responseActivite toResponse(Activite activite) {
        return responseActivite.builder()
                .id(activite.getId())
                .nom(activite.getNom())
                .description(activite.getDescription())
                .date(activite.getDate())
                .budget(activite.getBudget())
                .participants(activite.getParticipants().stream()
                        .map(orphelinMapper::toResponse)
                        .collect(Collectors.toSet()))
                .build();
    }
}
