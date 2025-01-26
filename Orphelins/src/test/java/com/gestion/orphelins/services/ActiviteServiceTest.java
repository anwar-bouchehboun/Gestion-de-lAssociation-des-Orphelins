package com.gestion.orphelins.services;

import com.gestion.orphelins.dto.request.requestActivite;
import com.gestion.orphelins.dto.response.responseActivite;
import com.gestion.orphelins.entity.Activite;
import com.gestion.orphelins.entity.Orphelin;
import com.gestion.orphelins.mapper.Activitemapper;
import com.gestion.orphelins.repository.ActiviteRepository;
import com.gestion.orphelins.services.implementation.ActiviteService;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class ActiviteServiceTest {

    @Mock
    private ActiviteRepository activiteRepository;

    @Mock
    private Activitemapper activiteMapper;

    @InjectMocks
    private ActiviteService activiteService;

    private Activite activite;
    private requestActivite requestActivite;
    private responseActivite responseActivite;
    private Set<Orphelin> participants;

    @BeforeEach
    void setUp() {
        participants = new HashSet<>();
        participants.add(Orphelin.builder().id(1L).nom("Orphelin Test").build());

        activite = Activite.builder()
                .id(1L)
                .nom("Activité Test")
                .description("Description test")
                .date(LocalDate.now())
                .budget(1000.0)
                .participants(participants)
                .build();

        requestActivite = new requestActivite();
        requestActivite.setNom("Activité Test");
        requestActivite.setDescription("Description test");
        requestActivite.setDate(LocalDate.now());
        requestActivite.setBudget(1000.0);
        requestActivite.setParticipantsIds(new HashSet<>(Collections.singletonList(1L)));

        responseActivite = responseActivite.builder()
                .id(1L)
                .nom("Activité Test")
                .description("Description test")
                .date(LocalDate.now())
                .budget(1000.0)
                .participants(new HashSet<>())
                .build();
    }

    @Test
    @DisplayName("Doit créer une activité avec succès")
    void createActivite_Success() {
        when(activiteRepository.existsByNom(any())).thenReturn(false);
        when(activiteMapper.toEntity(any())).thenReturn(activite);
        when(activiteRepository.save(any())).thenReturn(activite);
        when(activiteMapper.toResponse(any())).thenReturn(responseActivite);

        responseActivite result = activiteService.createActivite(requestActivite);

        assertNotNull(result);
        assertEquals(responseActivite.getNom(), result.getNom());
        verify(activiteRepository).save(any());
    }

    @Test
    @DisplayName("Doit échouer si le nom existe déjà")
    void createActivite_DuplicateName() {
        when(activiteRepository.existsByNom(any())).thenReturn(true);

        assertThrows(NotFoundExceptionHndler.class, () -> activiteService.createActivite(requestActivite));
    }

    @Test
    @DisplayName("Doit retourner une activité par ID")
    void getActiviteById_Success() {
        when(activiteRepository.findById(1L)).thenReturn(Optional.of(activite));
        when(activiteMapper.toResponse(activite)).thenReturn(responseActivite);

        responseActivite result = activiteService.getActiviteById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    @DisplayName("Doit retourner toutes les activités paginées")
    void getAllActivitesPaginated_Success() {
        Page<Activite> activitePage = new PageImpl<>(Arrays.asList(activite));
        when(activiteRepository.findAll(any(PageRequest.class))).thenReturn(activitePage);
        when(activiteMapper.toResponse(any())).thenReturn(responseActivite);

        Page<responseActivite> result = activiteService.getAllActivitesPaginated(PageRequest.of(0, 10));

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Doit mettre à jour une activité avec succès")
    void updateActivite_Success() {
        when(activiteRepository.findById(1L)).thenReturn(Optional.of(activite));
        when(activiteMapper.toEntity(any())).thenReturn(activite);
        when(activiteRepository.save(any())).thenReturn(activite);
        when(activiteMapper.toResponse(any())).thenReturn(responseActivite);

        responseActivite result = activiteService.updateActivite(1L, requestActivite);

        assertNotNull(result);
        assertEquals(responseActivite.getNom(), result.getNom());
    }

    @Test
    @DisplayName("Doit supprimer une activité avec succès")
    void deleteActivite_Success() {
        when(activiteRepository.existsById(1L)).thenReturn(true);
        doNothing().when(activiteRepository).deleteById(1L);

        assertDoesNotThrow(() -> activiteService.deleteActivite(1L));
        verify(activiteRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Doit sauvegarder plusieurs activités avec succès")
    void saveAllActivites_Success() {
        List<requestActivite> requests = Arrays.asList(requestActivite);
        when(activiteMapper.toEntity(any())).thenReturn(activite);
        when(activiteRepository.saveAll(any())).thenReturn(Arrays.asList(activite));
        when(activiteMapper.toResponse(any())).thenReturn(responseActivite);

        List<responseActivite> results = activiteService.saveAllActivites(requests);

        assertNotNull(results);
        assertEquals(1, results.size());
    }

    @Test
    @DisplayName("Doit retourner les activités par nom")
    void getAllActivitesByNom_Success() {
        when(activiteRepository.findByNomContaining(any())).thenReturn(Arrays.asList(activite));
        when(activiteMapper.toResponse(any())).thenReturn(responseActivite);

        List<responseActivite> results = activiteService.getAllActivitesByNom("Test");

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }
}
