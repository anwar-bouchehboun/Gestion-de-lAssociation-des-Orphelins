package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import com.gestion.orphelins.entity.Don;
import com.gestion.orphelins.enums.Statut;
import org.springframework.stereotype.Component;


@Component
public class Donmapper {


    public Don toEntity(requestDon request) {
        Don don = Don.builder()
        .nomDonateur(request.getNomDonateur())
        .montant(request.getMontant())
        .objectif(request.getObjectif())
        .statut(Statut.valueOf(request.getStatut()))
        .build();
       
        return don;
    }

    public responseDon toResponse(Don don) {
        return responseDon.builder()
        .id(don.getId())
        .nomDonateur(don.getNomDonateur())
        .montant(don.getMontant())
        .objectif(don.getObjectif())
        .statut(don.getStatut())
       .dateCreation(don.getDateCreation())
        .dateModification(don.getDateModification())
        .build();
               
    }
}
