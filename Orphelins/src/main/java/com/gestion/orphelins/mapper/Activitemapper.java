package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestActivite;
import com.gestion.orphelins.dto.response.responseActivite;
import com.gestion.orphelins.dto.response.responseOrphelin;
import com.gestion.orphelins.entity.Activite;
import com.gestion.orphelins.entity.Orphelin;
import com.gestion.orphelins.repository.OrphelinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class Activitemapper {

        private final OrphelinRepository orphelinRepository;
        private final Orphelinmapper orphelinMapper;

        public Activite toEntity(requestActivite request) {
                if (request == null)
                        return null;

                Set<Orphelin> participants = request.getParticipantsIds() != null
                                ? request.getParticipantsIds().stream()
                                                .map(id -> orphelinRepository.findById(id).orElse(null))
                                                .filter(orphelin -> orphelin != null)
                                                .collect(Collectors.toSet())
                                : new HashSet<>();

                return Activite.builder()
                                .nom(request.getNom())
                                .description(request.getDescription())
                                .date(request.getDate())
                                .budget(request.getBudget())
                                .participants(participants)
                                .build();
        }

        public responseActivite toResponse(Activite activite) {
                if (activite == null)
                        return null;

                Set<responseOrphelin> participants = activite.getParticipants() != null
                                ? activite.getParticipants().stream()
                                                .map(orphelinMapper::toResponse)
                                                .collect(Collectors.toSet())
                                : new HashSet<>();

                return responseActivite.builder()
                                .id(activite.getId())
                                .nom(activite.getNom())
                                .description(activite.getDescription())
                                .date(activite.getDate())
                                .budget(activite.getBudget())
                                .participants(participants)
                                .build();
        }
}
