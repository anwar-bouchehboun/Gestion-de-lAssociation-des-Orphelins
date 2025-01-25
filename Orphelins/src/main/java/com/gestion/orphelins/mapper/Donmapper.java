package com.gestion.orphelins.mapper;

import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import com.gestion.orphelins.entity.Don;
import org.springframework.stereotype.Component;


@Component
public class Donmapper {


    public Don toEntity(requestDon request) {
        Don don = Don.builder()
        .nomDonateur(request.getNomDonateur())
        .montant(request.getMontant())
        .objectif(request.getObjectif())
        .date(request.getDate())
        .build();
       
        return don;
    }

    public responseDon toResponse(Don don) {
        return responseDon.builder()
        .id(don.getId())
        .nomDonateur(don.getNomDonateur())
        .montant(don.getMontant())
        .objectif(don.getObjectif())
        .date(don.getDate())
        .build();
               
    }
}
