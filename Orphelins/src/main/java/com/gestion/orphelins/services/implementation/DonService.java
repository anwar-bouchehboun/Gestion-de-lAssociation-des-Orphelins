package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import com.gestion.orphelins.entity.Don;
import com.gestion.orphelins.mapper.Donmapper;
import com.gestion.orphelins.repository.DonRepository;
import com.gestion.orphelins.services.interfaces.DonInterface;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;
import com.gestion.orphelins.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DonService implements DonInterface {
    private final DonRepository donRepository;
    private final Donmapper donMapper;

    @Override
    public responseDon createDon(requestDon request) {
        Don don = donMapper.toEntity(request);
        Don savedDon = donRepository.save(don);
        return donMapper.toResponse(savedDon);
    }

    @Override
    public responseDon getDonById(Long id) {
        Don don = donRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Don non trouvé avec l'id: " + id));
        return donMapper.toResponse(don);
    }

    @Override
    public responseDon getDonByNomDonateur(String nomDonateur) {
        List<Don> dons = donRepository.findByNomDonateurContaining(nomDonateur);
        if (dons.isEmpty()) {
            throw new NotFoundExceptionHndler("Don non trouvé avec le nom du donateur: " + nomDonateur);
        }
        return donMapper.toResponse(dons.get(0));
    }

    @Override
    public List<responseDon> getAllDons() {
        return donRepository.findAll().stream()
                .map(donMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public responseDon updateDon(Long id, requestDon request) {
        Don existingDon = donRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Don non trouvé avec l'id: " + id));
        if (request.getStatut() == null) {
            throw new ValidationException("Le statut ne peut pas être null");
        }
        Don updatedDon = donMapper.toEntity(request);
        updatedDon.setId(existingDon.getId());
        return donMapper.toResponse(donRepository.save(updatedDon));
    }

    @Override
    public void deleteDon(Long id) {
        if (!donRepository.existsById(id)) {
            throw new NotFoundExceptionHndler("Don non trouvé avec l'id: " + id);
        }
        donRepository.deleteById(id);
    }

    @Override
    public Page<responseDon> getAllDonsPaginated(Pageable pageable) {
        return donRepository.findAll(pageable)
                .map(donMapper::toResponse);
    }

    @Override
    public List<responseDon> findByDateCreationBetween(LocalDate dateDebut, LocalDate dateFin) {
        return donRepository.findByDateCreationBetween(dateDebut, dateFin)
                .stream()
                .map(donMapper::toResponse)
                .collect(Collectors.toList());
    }
}
