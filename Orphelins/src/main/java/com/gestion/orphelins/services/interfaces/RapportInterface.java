package com.gestion.orphelins.services.interfaces;

import com.gestion.orphelins.dto.request.requestRapport;
import com.gestion.orphelins.dto.response.responseRapport;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface RapportInterface {
    // Méthodes CRUD de base
    responseRapport creerRapport(requestRapport request);

    responseRapport getRapportById(Long id);

    List<responseRapport> getAllRapports();

    Page<responseRapport> getAllRapports(Pageable pageable);

    responseRapport updateRapport(Long id, requestRapport request);

    void deleteRapport(Long id);

    // Méthodes de génération de rapports spécifiques
    responseRapport genererRapportActivite(Long activiteId);

    responseRapport genererRapportDon(Long donId);


    // Méthodes de recherche optionnelles
    List<responseRapport> getRapportsByType(String type);

    List<responseRapport> getRapportsByDateBetween(String dateDebut, String dateFin);

}
