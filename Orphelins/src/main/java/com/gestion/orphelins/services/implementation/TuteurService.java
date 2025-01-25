package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.dto.request.requestTuteur;
import com.gestion.orphelins.dto.response.responseTuteur;
import com.gestion.orphelins.entity.Tuteur;
import com.gestion.orphelins.mapper.Tuteurmapper;
import com.gestion.orphelins.repository.TuteurRepository;
import com.gestion.orphelins.services.interfaces.TuteurInterface;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;
import com.gestion.orphelins.validation.ValidationException;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TuteurService implements TuteurInterface {
    private final TuteurRepository tuteurRepository;
    private final Tuteurmapper tuteurMapper;

    @Override
    public responseTuteur createTuteur(requestTuteur request) {
        checkTuteur(request, null);
        Tuteur tuteur = tuteurMapper.toEntity(request);
        Tuteur savedTuteur = tuteurRepository.save(tuteur);
        return tuteurMapper.toResponse(savedTuteur);
    }
    
    @Override
    public List<responseTuteur> createMultipleTuteurs(List<requestTuteur> requests) {
        // Vérifier chaque tuteur avant de les sauvegarder
        requests.forEach(request -> checkTuteur(request, null));

        // Convertir les requêtes en entités et les sauvegarder
        List<Tuteur> tuteurs = requests.stream()
                .map(tuteurMapper::toEntity)
                .collect(Collectors.toList());

        List<Tuteur> savedTuteurs = tuteurRepository.saveAll(tuteurs);

        // Convertir les entités sauvegardées en réponses
        return savedTuteurs.stream()
                .map(tuteurMapper::toResponse)
                .collect(Collectors.toList());
    }


    @Override
    public responseTuteur getTuteurById(Long id) {
        Tuteur tuteur = tuteurRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Tuteur non trouvé avec l'id: " + id));
        return tuteurMapper.toResponse(tuteur);
    }

    @Override
    public List<responseTuteur> getAllTuteurs() {
        return tuteurRepository.findAll().stream()
                .map(tuteurMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<responseTuteur> getAllTuteursPaginated(Pageable pageable) {
        return tuteurRepository.findAll(pageable)
                .map(tuteurMapper::toResponse);
    }

    @Override
    public responseTuteur updateTuteur(Long id, requestTuteur request) {
        Tuteur existingTuteur = tuteurRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Tuteur non trouvé avec l'id: " + id));

        checkTuteur(request, id); // Passer l'ID pour la vérification

        Tuteur updatedTuteur = tuteurMapper.toEntity(request);
        updatedTuteur.setId(existingTuteur.getId());
        updatedTuteur.setOrphelins(existingTuteur.getOrphelins());
        return tuteurMapper.toResponse(tuteurRepository.save(updatedTuteur));
    }

    @Override
    public void deleteTuteur(Long id) {
        Tuteur tuteur = tuteurRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Tuteur non trouvé avec l'id: " + id));

        if (!tuteur.getOrphelins().isEmpty()) {
            throw new ValidationException("Impossible de supprimer un tuteur qui a des orphelins associés");
        }

        tuteurRepository.deleteById(id);
    }

    @Override
    public responseTuteur getTuteurByNom(String nomTuteur) {
        Tuteur tuteur = tuteurRepository.findByNomContaining(nomTuteur)
                .orElseThrow(() -> new NotFoundExceptionHndler("Tuteur non trouvé avec le nom: " + nomTuteur));
        return tuteurMapper.toResponse(tuteur);
    }

 

    private void checkTuteur(requestTuteur request, Long tuteurId) {
        // Vérifier si un autre tuteur utilise déjà ce téléphone
        tuteurRepository.findByTelephone(request.getTelephone())
                .ifPresent(existingTuteur -> {
                    if (!existingTuteur.getId().equals(tuteurId)) {
                        throw new ValidationException("Un autre tuteur utilise déjà ce numéro de téléphone");
                    }
                });

        // Vérifier si un autre tuteur utilise déjà cet email
        tuteurRepository.findByEmail(request.getEmail())
                .ifPresent(existingTuteur -> {
                    if (!existingTuteur.getId().equals(tuteurId)) {
                        throw new ValidationException("Un autre tuteur utilise déjà cet email");
                    }
                });
    }
}
