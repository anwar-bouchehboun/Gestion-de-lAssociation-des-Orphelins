package com.gestion.orphelins.services;

import com.gestion.orphelins.dto.request.requestOrphelin;
import com.gestion.orphelins.dto.response.responseOrphelin;
import com.gestion.orphelins.entity.Orphelin;
import com.gestion.orphelins.entity.Tuteur;
import com.gestion.orphelins.mapper.Orphelinmapper;
import com.gestion.orphelins.repository.OrphelinRepository;
import com.gestion.orphelins.repository.TuteurRepository;
import com.gestion.orphelins.services.implementation.OrphelinService;
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

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class OrphelinServiceTest {

    @Mock
    private OrphelinRepository orphelinRepository;

    @Mock
    private TuteurRepository tuteurRepository;

    @Mock
    private Orphelinmapper orphelinMapper;

    @InjectMocks
    private OrphelinService orphelinService;

    private Orphelin orphelin;
    private Tuteur tuteur;
    private requestOrphelin requestOrphelin;
    private responseOrphelin responseOrphelin;

    @BeforeEach
    void setUp() {
        tuteur = Tuteur.builder()
                .id(1L)
                .nom("Tuteur Test")
                .build();

        orphelin = Orphelin.builder()
                .id(1L)
                .nom("Test Orphelin")
                .age(12)
                .genre("Masculin")
                .etatDeSante("Bon")
                .tuteur(tuteur)
                .build();

        requestOrphelin = new requestOrphelin();
        requestOrphelin.setNom("Test Orphelin");
        requestOrphelin.setAge(12);
        requestOrphelin.setGenre("Masculin");
        requestOrphelin.setEtatDeSante("Bon");
        requestOrphelin.setTuteurId(1L);

        responseOrphelin = responseOrphelin.builder()
                .id(1L)
                .nom("Test Orphelin")
                .age(12)
                .genre("Masculin")
                .etatDeSante("Bon")
                .build();
    }

    @Test
    @DisplayName("Doit créer un orphelin avec succès")
    void createOrphelin_Success() {
        when(orphelinRepository.existsByNom(any())).thenReturn(false);
        when(tuteurRepository.findById(1L)).thenReturn(Optional.of(tuteur));
        when(orphelinMapper.toEntity(any(), any())).thenReturn(orphelin);
        when(orphelinRepository.save(any())).thenReturn(orphelin);
        when(orphelinMapper.toResponse(any())).thenReturn(responseOrphelin);

        responseOrphelin result = orphelinService.createOrphelin(requestOrphelin);

        assertNotNull(result);
        assertEquals(responseOrphelin.getNom(), result.getNom());
        verify(orphelinRepository).save(any());
    }

    @Test
    @DisplayName("Doit échouer si le tuteur n'existe pas")
    void createOrphelin_TuteurNotFound() {
        when(orphelinRepository.existsByNom(any())).thenReturn(false);
        when(tuteurRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(NotFoundExceptionHndler.class, () -> orphelinService.createOrphelin(requestOrphelin));
    }

    @Test
    @DisplayName("Doit retourner un orphelin par ID")
    void getOrphelinById_Success() {
        when(orphelinRepository.findById(1L)).thenReturn(Optional.of(orphelin));
        when(orphelinMapper.toResponse(orphelin)).thenReturn(responseOrphelin);

        responseOrphelin result = orphelinService.getOrphelinById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    @DisplayName("Doit retourner tous les orphelins paginés")
    void getAllOrphelinsPaginated_Success() {
        Page<Orphelin> orphelinPage = new PageImpl<>(Arrays.asList(orphelin));
        when(orphelinRepository.findAll(any(PageRequest.class))).thenReturn(orphelinPage);
        when(orphelinMapper.toResponse(any())).thenReturn(responseOrphelin);

        Page<responseOrphelin> result = orphelinService.getAllOrphelinsPaginated(PageRequest.of(0, 10));

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Doit mettre à jour un orphelin avec succès")
    void updateOrphelin_Success() {
        when(orphelinRepository.findById(1L)).thenReturn(Optional.of(orphelin));
        when(tuteurRepository.findById(1L)).thenReturn(Optional.of(tuteur));
        when(orphelinMapper.toEntity(any(), any())).thenReturn(orphelin);
        when(orphelinRepository.save(any())).thenReturn(orphelin);
        when(orphelinMapper.toResponse(any())).thenReturn(responseOrphelin);

        responseOrphelin result = orphelinService.updateOrphelin(1L, requestOrphelin);

        assertNotNull(result);
        assertEquals(responseOrphelin.getNom(), result.getNom());
    }

    @Test
    @DisplayName("Doit supprimer un orphelin avec succès")
    void deleteOrphelin_Success() {
        when(orphelinRepository.existsById(1L)).thenReturn(true);
        doNothing().when(orphelinRepository).deleteById(1L);

        assertDoesNotThrow(() -> orphelinService.deleteOrphelin(1L));
        verify(orphelinRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Doit retourner les orphelins par nom")
    void getAllOrphelinsByNom_Success() {
        when(orphelinRepository.findByNomContaining("Test")).thenReturn(Arrays.asList(orphelin));
        when(orphelinMapper.toResponse(any())).thenReturn(responseOrphelin);

        List<responseOrphelin> results = orphelinService.getAllOrphelinsByNom("Test");

        assertNotNull(results);
        assertFalse(results.isEmpty());
        assertEquals(1, results.size());
    }
}
