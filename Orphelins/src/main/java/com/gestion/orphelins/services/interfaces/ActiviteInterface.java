package com.gestion.orphelins.services.interfaces;

import com.gestion.orphelins.dto.request.requestActivite;
import com.gestion.orphelins.dto.response.responseActivite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ActiviteInterface {
    // Opérations CRUD de base
    responseActivite createActivite(requestActivite request);

    responseActivite getActiviteById(Long id);

    List<responseActivite> getAllActivites();

    Page<responseActivite> getAllActivitesPaginated(Pageable pageable);

    responseActivite updateActivite(Long id, requestActivite request);

    void deleteActivite(Long id);

    List<responseActivite> saveAllActivites(List<requestActivite> requests);

    List<responseActivite> getAllActivitesByNom(String nom);

    responseActivite getActiviteByNom(String nom);
}
