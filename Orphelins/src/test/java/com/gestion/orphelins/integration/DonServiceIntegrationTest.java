package com.gestion.orphelins.integration;

import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import com.gestion.orphelins.entity.Don;
import com.gestion.orphelins.enums.Statut;
import com.gestion.orphelins.repository.DonRepository;
import com.gestion.orphelins.services.implementation.DonService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DonServiceIntegrationTest {

    @Autowired
    private DonService donService;

    @Autowired
    private DonRepository donRepository;

    private requestDon requestDon;

    @BeforeEach
    void setUp() {
        donRepository.deleteAll();

        requestDon = new requestDon();
        requestDon.setNomDonateur("Test Donateur");
        requestDon.setMontant(1000.0);
        requestDon.setObjectif("Aide aux orphelins");
        requestDon.setStatut("RECU");
    }

    @Test
    @DisplayName("Doit créer et récupérer un don")
    void createAndRetrieveDon() {
        // Création
        responseDon created = donService.createDon(requestDon);

        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals(requestDon.getNomDonateur(), created.getNomDonateur());
        assertEquals(requestDon.getMontant(), created.getMontant());
        assertEquals(requestDon.getObjectif(), created.getObjectif());
        assertEquals(Statut.RECU, created.getStatut());
        assertNotNull(created.getDateCreation());

        // Récupération
        responseDon retrieved = donService.getDonById(created.getId());
        assertEquals(created.getId(), retrieved.getId());
        assertEquals(created.getNomDonateur(), retrieved.getNomDonateur());
    }

    @Test
    @DisplayName("Doit récupérer tous les dons paginés")
    void getAllDonsPaginated() {
        // Création de plusieurs dons
        for (int i = 0; i < 3; i++) {
            requestDon.setNomDonateur("Donateur " + i);
            donService.createDon(requestDon);
        }

        Page<responseDon> page = donService.getAllDonsPaginated(PageRequest.of(0, 2));

        assertNotNull(page);
        assertEquals(2, page.getContent().size());
        assertEquals(3, page.getTotalElements());
        assertTrue(page.getContent().stream()
                .allMatch(don -> don.getNomDonateur().startsWith("Donateur")));
    }

    @Test
    @DisplayName("Doit mettre à jour un don")
    void updateDon() {
        // Créer d'abord un don initial
        requestDon = new requestDon(
            "Test Donateur",
            1000.0,
            "Objectif initial",
            "RECU"
        );
        responseDon created = donService.createDon(requestDon);
        assertNotNull(created);

        // Créer une nouvelle requête pour la mise à jour
        requestDon = new requestDon(
            "Test Donateur Updated",
            2000.0,
            "Nouvel objectif",
            "RECU"
        );

        // Effectuer et vérifier la mise à jour
        responseDon updated = donService.updateDon(created.getId(), requestDon);

        assertNotNull(updated);
        assertEquals("Test Donateur Updated", updated.getNomDonateur());
        assertEquals(2000.0, updated.getMontant());
        assertEquals("Nouvel objectif", updated.getObjectif());
        assertEquals(Statut.RECU, updated.getStatut());
    }

    @Test
    @DisplayName("Doit supprimer un don")
    void deleteDon() {
        responseDon created = donService.createDon(requestDon);
        assertNotNull(created);

        donService.deleteDon(created.getId());

        assertFalse(donRepository.findById(created.getId()).isPresent());
    }

    @Test
    @DisplayName("Doit trouver les dons par date")
    void findDonsByDateRange() {
        LocalDate today = LocalDate.now();
        donService.createDon(requestDon);

        List<responseDon> dons = donService.findByDateCreationBetween(
                today.minusDays(1),
                today.plusDays(1));

        assertFalse(dons.isEmpty());
        assertEquals(1, dons.size());
        assertTrue(dons.stream()
                .allMatch(don -> don.getDateCreation().equals(today)));
    }

    @Test
    @DisplayName("Doit trouver un don par nom de donateur")
    void findDonByNomDonateur() {
        donService.createDon(requestDon);

        responseDon found = donService.getDonByNomDonateur("Test Donateur");

        assertNotNull(found);
        assertEquals(requestDon.getNomDonateur(), found.getNomDonateur());
        assertEquals(requestDon.getMontant(), found.getMontant());
        assertEquals(requestDon.getObjectif(), found.getObjectif());
    }
}
