package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.dto.request.requestRapport;
import com.gestion.orphelins.dto.response.responseRapport;
import com.gestion.orphelins.entity.*;
import com.gestion.orphelins.mapper.Rapportmapper;
import com.gestion.orphelins.repository.RapportRepository;
import com.gestion.orphelins.repository.ActiviteRepository;
import com.gestion.orphelins.repository.DonRepository;
import com.gestion.orphelins.services.interfaces.RapportInterface;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.validation.ValidationException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@Transactional
@RequiredArgsConstructor
public class RapportService implements RapportInterface {

    private final RapportRepository rapportRepository;
    private final ActiviteRepository activiteRepository;
    private final DonRepository donRepository;
    private final Rapportmapper rapportMapper;

    @Override
    public responseRapport creerRapport(requestRapport request) {
        Rapport rapport = rapportMapper.toEntity(request);
        Rapport savedRapport = rapportRepository.save(rapport);
        return rapportMapper.toResponse(savedRapport);
    }

    @Override
    public responseRapport getRapportById(Long id) {
        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Rapport non trouvé avec l'id: " + id));
        return rapportMapper.toResponse(rapport);
    }

    @Override
    public List<responseRapport> getAllRapports() {
        return rapportRepository.findAll()
                .stream()
                .map(rapportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<responseRapport> getAllRapports(Pageable pageable) {
        return rapportRepository.findAll(pageable)
                .map(rapportMapper::toResponse);
    }

    @Override
    public responseRapport updateRapport(Long id, requestRapport request) {
        Rapport rapport = rapportRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Rapport non trouvé avec l'id: " + id));

        rapport.setType(request.getType());
        rapport.setContenu(request.getContenu());
        rapport.setDescription(request.getDescription());
        rapport.setDate(request.getDate());
        rapport.setDateModification(LocalDate.now());
        

        Rapport updatedRapport = rapportRepository.save(rapport);
        System.out.println(updatedRapport.getDateModification());
        return rapportMapper.toResponse(updatedRapport);
    }

    @Override
    public void deleteRapport(Long id) {
        if (!rapportRepository.existsById(id)) {
            throw new NotFoundExceptionHndler("Rapport non trouvé avec l'id: " + id);
        }
        rapportRepository.deleteById(id);
    }

    @Override
    public responseRapport genererRapportActivite(Long activiteId) {
        Activite activite = activiteRepository.findById(activiteId)
                .orElseThrow(() -> new NotFoundExceptionHndler("Activité non trouvée avec l'id: " + activiteId));
        String contenu = String.format(
                "Rapport d'activité" +
                        " Nom: %s" +
                        " Date: %s" +
                        " Budget: %s"+
                        " Nombre de participants:  %s" +
                        " Participants: %s",
                activite.getNom(),
                activite.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")),
                activite.getBudget(),
                activite.getParticipants().size(),
                activite.getParticipants().stream()
                        .map(Orphelin::getNom)
                        .collect(Collectors.joining(", ")));
        Rapport rapport = Rapport.builder()
                .type("ACTIVITE")
                .contenu(contenu)
                .description(activite.getDescription())
                .date(LocalDate.now())
                .build();

        return rapportMapper.toResponse(rapport);
    }

    @Override
    public responseRapport genererRapportDon(Long donId) {
        Don don = donRepository.findById(donId)
                .orElseThrow(() -> new NotFoundExceptionHndler("Don non trouvé avec l'id: " + donId));

        String contenu = String.format(
                "Donateur: %s" +
                        " ,Montant: %s" +
                        " , Date: %s" +
                        " ,Status: %s ",
                don.getNomDonateur(),
                don.getMontant(),
                don.getDateCreation(),
                don.getStatut());

        Rapport rapport = Rapport.builder()
                .type("DON")
                .contenu(contenu)
                .description(don.getObjectif())
                .date(LocalDate.now())
                .build();

        return rapportMapper.toResponse(rapport);
    }

    @Override
    public List<responseRapport> getRapportsByType(String type) {
        return rapportRepository.findByTypeContaining(type)
                .stream()
                .map(rapportMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<responseRapport> getRapportsByDateBetween(String dateDebut, String dateFin) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate debut = LocalDate.parse(dateDebut, formatter);
        LocalDate fin = LocalDate.parse(dateFin, formatter);

        return rapportRepository.findByDateBetween(debut, fin)
                .stream()
                .map(rapportMapper::toResponse)
                .collect(Collectors.toList());
    }
}
