package com.gestion.orphelins.services.interfaces;

import org.springframework.data.domain.Page;

import com.gestion.orphelins.dto.request.requestTuteur;
import com.gestion.orphelins.dto.response.responseTuteur;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TuteurInterface {
    responseTuteur createTuteur(requestTuteur request);

    List<responseTuteur> createMultipleTuteurs(List<requestTuteur> requests);

    responseTuteur getTuteurById(Long id);

    List<responseTuteur> getAllTuteurs();

    Page<responseTuteur> getAllTuteursPaginated(Pageable pageable);

    responseTuteur updateTuteur(Long id, requestTuteur request);

    void deleteTuteur(Long id);

    responseTuteur getTuteurByNom(String nomTuteur);

}
