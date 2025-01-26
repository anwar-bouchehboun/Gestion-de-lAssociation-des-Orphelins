package com.gestion.orphelins.services;

import com.gestion.orphelins.dto.request.requestTuteur;
import com.gestion.orphelins.dto.response.responseTuteur;
import com.gestion.orphelins.entity.Orphelin;
import com.gestion.orphelins.entity.Tuteur;
import com.gestion.orphelins.mapper.Tuteurmapper;
import com.gestion.orphelins.repository.TuteurRepository;
import com.gestion.orphelins.services.implementation.TuteurService;
import com.gestion.orphelins.validation.ValidationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@SpringBootTest
class TuteurServiceTest {

    @Mock
    private TuteurRepository tuteurRepository;

    @Mock
    private Tuteurmapper tuteurMapper;

    @InjectMocks
    private TuteurService tuteurService;

    private Tuteur tuteur;
    private requestTuteur requestTuteur;
    private responseTuteur responseTuteur;

    @BeforeEach
    void setUp() {
        tuteur = Tuteur.builder()
                .id(1L)
                .nom("John Doe")
                .telephone("0612345678")
                .email("john@example.com")
                .build();

        requestTuteur = new requestTuteur();
        requestTuteur.setNom("John Doe");
        requestTuteur.setTelephone("0612345678");
        requestTuteur.setEmail("john@example.com");

        responseTuteur = responseTuteur.builder()
                .id(1L)
                .nom("John Doe")
                .telephone("0612345678")
                .email("john@example.com")
                .build();
    }

    @Test
    @DisplayName("Doit créer un tuteur avec succès")
    void createTuteur_Success() {
        when(tuteurRepository.findByTelephone(any())).thenReturn(Optional.empty());
        when(tuteurRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(tuteurMapper.toEntity(any())).thenReturn(tuteur);
        when(tuteurRepository.save(any())).thenReturn(tuteur);
        when(tuteurMapper.toResponse(any())).thenReturn(responseTuteur);

        responseTuteur result = tuteurService.createTuteur(requestTuteur);

        assertNotNull(result);
        assertEquals(responseTuteur.getNom(), result.getNom());
        verify(tuteurRepository).save(any());
    }

    @Test
    @DisplayName("Doit échouer si le téléphone existe déjà")
    void createTuteur_DuplicatePhone() {
        when(tuteurRepository.findByTelephone(any())).thenReturn(Optional.of(tuteur));

        assertThrows(ValidationException.class, () -> tuteurService.createTuteur(requestTuteur));
    }

    @Test
    @DisplayName("Doit créer plusieurs tuteurs avec succès")
    void createMultipleTuteurs_Success() {
        List<requestTuteur> requests = Arrays.asList(requestTuteur);
        when(tuteurRepository.findByTelephone(any())).thenReturn(Optional.empty());
        when(tuteurRepository.findByEmail(any())).thenReturn(Optional.empty());
        when(tuteurMapper.toEntity(any())).thenReturn(tuteur);
        when(tuteurRepository.saveAll(any())).thenReturn(Arrays.asList(tuteur));
        when(tuteurMapper.toResponse(any())).thenReturn(responseTuteur);

        List<responseTuteur> results = tuteurService.createMultipleTuteurs(requests);

        assertNotNull(results);
        assertEquals(1, results.size());
    }

    @Test
    @DisplayName("Doit retourner un tuteur par ID")
    void getTuteurById_Success() {
        when(tuteurRepository.findById(1L)).thenReturn(Optional.of(tuteur));
        when(tuteurMapper.toResponse(tuteur)).thenReturn(responseTuteur);

        responseTuteur result = tuteurService.getTuteurById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    @DisplayName("Doit retourner tous les tuteurs paginés")
    void getAllTuteursPaginated_Success() {
        Page<Tuteur> tuteurPage = new PageImpl<>(Arrays.asList(tuteur));
        when(tuteurRepository.findAll(any(PageRequest.class))).thenReturn(tuteurPage);
        when(tuteurMapper.toResponse(any())).thenReturn(responseTuteur);

        Page<responseTuteur> result = tuteurService.getAllTuteursPaginated(PageRequest.of(0, 10));

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Doit supprimer un tuteur sans orphelins")
    void deleteTuteur_Success() {
        when(tuteurRepository.findById(1L)).thenReturn(Optional.of(tuteur));
        doNothing().when(tuteurRepository).deleteById(1L);

        assertDoesNotThrow(() -> tuteurService.deleteTuteur(1L));
        verify(tuteurRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Doit échouer à supprimer un tuteur avec orphelins")
    void deleteTuteur_WithOrphelins() {
        Tuteur tuteurWithOrphelins = tuteur;
        tuteurWithOrphelins.getOrphelins().add(new Orphelin());
        when(tuteurRepository.findById(1L)).thenReturn(Optional.of(tuteurWithOrphelins));

        assertThrows(ValidationException.class, () -> tuteurService.deleteTuteur(1L));
    }
}