package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.dto.request.requestActivite;
import com.gestion.orphelins.dto.response.responseActivite;
import com.gestion.orphelins.entity.Activite;
import com.gestion.orphelins.mapper.Activitemapper;
import com.gestion.orphelins.repository.ActiviteRepository;
import com.gestion.orphelins.services.interfaces.ActiviteInterface;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ActiviteService implements ActiviteInterface {

    private final ActiviteRepository activiteRepository;
    private final Activitemapper activitemapper;

    @Override
    public responseActivite createActivite(requestActivite request) {
        checkActivite(request);
        Activite activite = activitemapper.toEntity(request);
        activiteRepository.save(activite);
        return activitemapper.toResponse(activite);
    }

    private void checkActivite(requestActivite request) {
        if (activiteRepository.existsByNom(request.getNom())) {
            throw new NotFoundExceptionHndler("Activité déjà existante avec le nom: " + request.getNom());
        }
    }

    @Override
    public responseActivite getActiviteById(Long id) {
        Activite activite = activiteRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Activité non trouvée avec l'id: " + id));
        return activitemapper.toResponse(activite);
    }

    @Override
    public List<responseActivite> getAllActivites() {
        return activiteRepository.findAll()
                .stream()
                .map(activitemapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<responseActivite> getAllActivitesPaginated(Pageable pageable) {
        return activiteRepository.findAll(pageable)
                .map(activitemapper::toResponse);
    }

    @Override
    public responseActivite updateActivite(Long id, requestActivite request) {
        Activite existingActivite = activiteRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Activité non trouvée avec l'id: " + id));

        Activite updatedActivite = activitemapper.toEntity(request);
        updatedActivite.setId(existingActivite.getId());
        return activitemapper.toResponse(activiteRepository.save(updatedActivite));
    }

    @Override
    public void deleteActivite(Long id) {
        if (!activiteRepository.existsById(id)) {
            throw new NotFoundExceptionHndler("Activité non trouvée avec l'id: " + id);
        }
        activiteRepository.deleteById(id);
    }

    @Override
    public List<responseActivite> saveAllActivites(List<requestActivite> requests) {
        List<Activite> activites = requests.stream()
                .map(activitemapper::toEntity)
                .collect(Collectors.toList());

        List<Activite> savedActivites = activiteRepository.saveAll(activites);
        return savedActivites.stream()
                .map(activitemapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<responseActivite> getAllActivitesByNom(String nom) {
        List<Activite> activites = activiteRepository.findByNomContaining(nom);
        if (activites.isEmpty()) {
            throw new NotFoundExceptionHndler("Aucune activité trouvée avec le nom: " + nom);
        }
        return activites.stream()
                .map(activitemapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public responseActivite getActiviteByNom(String nom) {
        Activite activite = activiteRepository.findByNom(nom)
                .orElseThrow(() -> new NotFoundExceptionHndler("Activité non trouvée avec le nom: " + nom));
        return activitemapper.toResponse(activite);
    }
}
