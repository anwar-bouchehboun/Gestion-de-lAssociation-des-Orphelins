package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestRapport;
import com.gestion.orphelins.dto.response.responseRapport;
import com.gestion.orphelins.entity.Rapport;
import org.springframework.stereotype.Component;

@Component
public class Rapportmapper {


    public Rapport toEntity(requestRapport request) {
        return Rapport.builder()
                .type(request.getType())
                .contenu(request.getContenu())
                .description(request.getDescription())
                .date(request.getDate())
                .build();
    }

    public responseRapport toResponse(Rapport rapport) {
        return responseRapport.builder()
                .id(rapport.getId())
                .type(rapport.getType())
                .contenu(rapport.getContenu())
                .description(rapport.getDescription())
                .date(rapport.getDate())
                .dateModification(rapport.getDateModification())
                .build();
    }
}
