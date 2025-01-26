package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.dto.request.requestOrphelin;
import com.gestion.orphelins.dto.response.responseOrphelin;
import com.gestion.orphelins.entity.Orphelin;
import com.gestion.orphelins.entity.Tuteur;
import com.gestion.orphelins.mapper.Orphelinmapper;
import com.gestion.orphelins.repository.OrphelinRepository;
import com.gestion.orphelins.services.interfaces.OrphelinInterface;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.gestion.orphelins.repository.TuteurRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrphelinService implements OrphelinInterface {

    private final OrphelinRepository orphelinRepository;
    private final Orphelinmapper orphelinmapper;
    private final TuteurRepository tuteurRepository;

    @Override
    public responseOrphelin createOrphelin(requestOrphelin request) {
        checkOrphelin(request);
        Tuteur tuteur = checkTuteur(request.getTuteurId());
        Orphelin orphelin = orphelinmapper.toEntity(request, tuteur);
        orphelinRepository.save(orphelin);
        return orphelinmapper.toResponse(orphelin);
    }

    public void checkOrphelin(requestOrphelin request) {
        if (orphelinRepository.existsByNom(request.getNom())) {
            throw new NotFoundExceptionHndler("Orphelin non trouvé avec le nom: " + request.getNom());
        }
    }

    public Tuteur checkTuteur(Long id) {
        return tuteurRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Tuteur non trouvé avec l'id: " + id));
    }

    @Override
    public responseOrphelin getOrphelinById(Long id) {
        Orphelin orphelin = orphelinRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Orphelin non trouvé avec l'id: " + id));
        return orphelinmapper.toResponse(orphelin);
    }

    @Override
    public List<responseOrphelin> getAllOrphelins() {
        return orphelinRepository.findAll()
                .stream()
                .map(orphelinmapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<responseOrphelin> getAllOrphelinsPaginated(Pageable pageable) {
        return orphelinRepository.findAll(pageable)
                .map(orphelinmapper::toResponse);
    }

    @Override
    public responseOrphelin updateOrphelin(Long id, requestOrphelin request) {
        Orphelin existingOrphelin = orphelinRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Orphelin non trouvé avec l'id: " + id));
        Tuteur tuteur = checkTuteur(request.getTuteurId());

        Orphelin updatedOrphelin = orphelinmapper.toEntity(request, tuteur);
        updatedOrphelin.setId(existingOrphelin.getId());
        return orphelinmapper.toResponse(orphelinRepository.save(updatedOrphelin));
    }

    @Override
    public void deleteOrphelin(Long id) {
        if (!orphelinRepository.existsById(id)) {
            throw new NotFoundExceptionHndler("Orphelin non trouvé avec l'id: " + id);
        }
        orphelinRepository.deleteById(id);
    }

    @Override
    public List<responseOrphelin> saveAllOrphelins(List<requestOrphelin> requests) {
        List<Orphelin> orphelins = requests.stream()
                .map(request -> {
                    Tuteur tuteur = checkTuteur(request.getTuteurId());
                    return orphelinmapper.toEntity(request, tuteur);
                })
                .collect(Collectors.toList());

        List<Orphelin> savedOrphelins = orphelinRepository.saveAll(orphelins);
        return savedOrphelins.stream()
                .map(orphelinmapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<responseOrphelin> getAllOrphelinsByNom(String nom) {
        List<Orphelin> orphelins = orphelinRepository.findByNomContaining(nom);
        return orphelins.stream()
                .map(orphelinmapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public responseOrphelin getOrphelinByNom(String nom) {
        Orphelin orphelin = orphelinRepository.findByNom(nom)
                .orElseThrow(() -> new NotFoundExceptionHndler("Orphelin non trouvé avec le nom: " + nom));
        return orphelinmapper.toResponse(orphelin);
    }

}
