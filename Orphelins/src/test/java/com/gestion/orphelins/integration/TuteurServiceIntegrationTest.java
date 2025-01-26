package com.gestion.orphelins.integration;

import com.gestion.orphelins.dto.request.requestTuteur;
import com.gestion.orphelins.dto.response.responseTuteur;
import com.gestion.orphelins.repository.TuteurRepository;
import com.gestion.orphelins.services.implementation.TuteurService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TuteurServiceIntegrationTest {

    @Autowired
    private TuteurService tuteurService;

    @Autowired
    private TuteurRepository tuteurRepository;

    private requestTuteur requestTuteur;

    @BeforeEach
    void setUp() {
        tuteurRepository.deleteAll();

        requestTuteur = new requestTuteur();
        requestTuteur.setNom("Test Tuteur");
        requestTuteur.setTelephone("0612345678");
        requestTuteur.setEmail("test@test.com");
        requestTuteur.setRelation("Parent");
    }

    @Test
    @DisplayName("Doit créer et récupérer un tuteur")
    void createAndRetrieveTuteur() {
        responseTuteur created = tuteurService.createTuteur(requestTuteur);

        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals(requestTuteur.getNom(), created.getNom());
        assertEquals(requestTuteur.getTelephone(), created.getTelephone());
        assertEquals(requestTuteur.getEmail(), created.getEmail());

        responseTuteur retrieved = tuteurService.getTuteurById(created.getId());
        assertEquals(created.getId(), retrieved.getId());
        assertEquals(created.getNom(), retrieved.getNom());
    }

    @Test
    @DisplayName("Doit créer plusieurs tuteurs")
    void createMultipleTuteurs() {
        requestTuteur secondTuteur = new requestTuteur();
        secondTuteur.setNom("Second Tuteur");
        secondTuteur.setEmail("second@test.com");
        secondTuteur.setTelephone("0612345673");
        secondTuteur.setRelation("Parent");

        List<requestTuteur> requests = Arrays.asList(requestTuteur, secondTuteur);
        List<responseTuteur> responses = tuteurService.createMultipleTuteurs(requests);

        assertNotNull(responses);
        assertEquals(2, responses.size());
        assertTrue(responses.stream().allMatch(tuteur -> tuteur.getId() != null));
    }

    @Test
    @DisplayName("Doit récupérer tous les tuteurs paginés")
    void getAllTuteursPaginated() {
        // Créer plusieurs tuteurs avec des numéros différents
        for (int i = 0; i < 3; i++) {
            requestTuteur = new requestTuteur();
            requestTuteur.setNom("Tuteur " + i);
            requestTuteur.setEmail("tuteur" + i + "@test.com");
            requestTuteur.setTelephone("062345672" + i); // Numéro unique pour chaque tuteur
            requestTuteur.setRelation("Parent");
            tuteurService.createTuteur(requestTuteur);
        }

        Page<responseTuteur> page = tuteurService.getAllTuteursPaginated(PageRequest.of(0, 2));

        assertNotNull(page);
        assertEquals(2, page.getContent().size());
        assertEquals(3, page.getTotalElements());
        assertTrue(page.getContent().stream()
                .allMatch(tuteur -> tuteur.getNom().startsWith("Tuteur")));
    }

    @Test
    @DisplayName("Doit mettre à jour un tuteur")
    void updateTuteur() {
        responseTuteur created = tuteurService.createTuteur(requestTuteur);
        assertNotNull(created);

        requestTuteur.setNom("Tuteur Updated");
        requestTuteur.setEmail("updated@test.com");
        requestTuteur.setRelation("Parent");

        responseTuteur updated = tuteurService.updateTuteur(created.getId(), requestTuteur);

        assertNotNull(updated);
        assertEquals("Tuteur Updated", updated.getNom());
        assertEquals("updated@test.com", updated.getEmail());
        assertEquals("Parent", updated.getRelation());
    }

    @Test
    @DisplayName("Doit supprimer un tuteur")
    void deleteTuteur() {
        responseTuteur created = tuteurService.createTuteur(requestTuteur);
        assertNotNull(created);

        tuteurService.deleteTuteur(created.getId());

        assertFalse(tuteurRepository.findById(created.getId()).isPresent());
    }

    @Test
    @DisplayName("Doit trouver un tuteur par nom")
    void getTuteurByNom() {
        tuteurService.createTuteur(requestTuteur);

        responseTuteur found = tuteurService.getTuteurByNom("Test Tuteur");

        assertNotNull(found);
        assertEquals(requestTuteur.getNom(), found.getNom());
        assertEquals(requestTuteur.getEmail(), found.getEmail());
        assertEquals(requestTuteur.getRelation(), found.getRelation());
    }

    @Test
    @DisplayName("Doit récupérer tous les tuteurs")
    void getAllTuteurs() {
        // Créer le premier tuteur
        tuteurService.createTuteur(requestTuteur);

        // Créer un second tuteur avec des données différentes
        requestTuteur = new requestTuteur();
        requestTuteur.setNom("Second Tuteur");
        requestTuteur.setEmail("second@test.com");
        requestTuteur.setTelephone("0612345676"); 
        requestTuteur.setRelation("Parent");
        tuteurService.createTuteur(requestTuteur);

        List<responseTuteur> tuteurs = tuteurService.getAllTuteurs();

        assertNotNull(tuteurs);
        assertEquals(2, tuteurs.size());
        assertTrue(tuteurs.stream()
                .anyMatch(tuteur -> tuteur.getNom().equals("Test Tuteur")));
        assertTrue(tuteurs.stream()
                .anyMatch(tuteur -> tuteur.getNom().equals("Second Tuteur")));
    }
}
