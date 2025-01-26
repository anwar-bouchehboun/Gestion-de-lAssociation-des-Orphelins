package com.gestion.orphelins.services.interfaces;

import com.gestion.orphelins.dto.request.requestOrphelin;
import com.gestion.orphelins.dto.response.responseOrphelin;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface OrphelinInterface {
    // Opérations CRUD de base
    responseOrphelin createOrphelin(requestOrphelin request);

    responseOrphelin getOrphelinById(Long id);

    List<responseOrphelin> getAllOrphelins();

    Page<responseOrphelin> getAllOrphelinsPaginated(Pageable pageable);

    responseOrphelin updateOrphelin(Long id, requestOrphelin request);

    void deleteOrphelin(Long id);

    List<responseOrphelin> saveAllOrphelins(List<requestOrphelin> requests);

    List<responseOrphelin> getAllOrphelinsByNom(String nom);

    responseOrphelin getOrphelinByNom(String nom);

}
