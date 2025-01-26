package com.gestion.orphelins.services;

import com.gestion.orphelins.dto.request.requestDon;
import com.gestion.orphelins.dto.response.responseDon;
import com.gestion.orphelins.entity.Don;
import com.gestion.orphelins.mapper.Donmapper;
import com.gestion.orphelins.repository.DonRepository;
import com.gestion.orphelins.services.implementation.DonService;
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
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
class DonServiceTest {

    @Mock
    private DonRepository donRepository;

    @Mock
    private Donmapper donMapper;

    @InjectMocks
    private DonService donService;

    private Don don;
    private requestDon requestDon;
    private responseDon responseDon;

    @BeforeEach
    void setUp() {
        // Configuration des données de test
        don = Don.builder()
                .id(1L)
                .nomDonateur("John Doe")
                .montant(1000.0)
                .dateCreation(LocalDate.now())
                .build();

        requestDon = new requestDon();
        requestDon.setNomDonateur("John Doe");
        requestDon.setMontant(1000.0);

        responseDon = responseDon.builder()
                .id(1L)
                .nomDonateur("John Doe")
                .montant(1000.0)
                .dateCreation(LocalDate.now())
                .build();
    }

    @Test
    @DisplayName("Doit créer un don avec succès")
    void createDon_Success() {
        when(donMapper.toEntity(any(requestDon.class))).thenReturn(don);
        when(donRepository.save(any(Don.class))).thenReturn(don);
        when(donMapper.toResponse(any(Don.class))).thenReturn(responseDon);

        responseDon result = donService.createDon(requestDon);

        assertNotNull(result);
        assertEquals(responseDon.getNomDonateur(), result.getNomDonateur());
        verify(donRepository).save(any(Don.class));
    }

    @Test
    @DisplayName("Doit retourner un don par ID")
    void getDonById_Success() {
        when(donRepository.findById(1L)).thenReturn(Optional.of(don));
        when(donMapper.toResponse(don)).thenReturn(responseDon);

        responseDon result = donService.getDonById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    @DisplayName("Doit lancer une exception quand le don n'existe pas")
    void getDonById_NotFound() {
        when(donRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundExceptionHndler.class, () -> donService.getDonById(1L));
    }

    @Test
    @DisplayName("Doit retourner tous les dons")
    void getAllDons_Success() {
        when(donRepository.findAll()).thenReturn(Arrays.asList(don));
        when(donMapper.toResponse(don)).thenReturn(responseDon);

        List<responseDon> result = donService.getAllDons();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("Doit mettre à jour un don existant")
    void updateDon_Success() {
        when(donRepository.findById(1L)).thenReturn(Optional.of(don));
        when(donMapper.toEntity(requestDon)).thenReturn(don);
        when(donRepository.save(any(Don.class))).thenReturn(don);
        when(donMapper.toResponse(don)).thenReturn(responseDon);

        responseDon result = donService.updateDon(1L, requestDon);

        assertNotNull(result);
        assertEquals(responseDon.getNomDonateur(), result.getNomDonateur());
    }

    @Test
    @DisplayName("Doit supprimer un don existant")
    void deleteDon_Success() {
        when(donRepository.existsById(1L)).thenReturn(true);
        doNothing().when(donRepository).deleteById(1L);

        assertDoesNotThrow(() -> donService.deleteDon(1L));
        verify(donRepository).deleteById(1L);
    }

    @Test
    @DisplayName("Doit retourner les dons paginés")
    void getAllDonsPaginated_Success() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Don> donPage = new PageImpl<>(Arrays.asList(don));

        when(donRepository.findAll(pageable)).thenReturn(donPage);
        when(donMapper.toResponse(don)).thenReturn(responseDon);

        Page<responseDon> result = donService.getAllDonsPaginated(pageable);

        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("Doit retourner les dons entre deux dates")
    void findByDateCreationBetween_Success() {
        LocalDate dateDebut = LocalDate.now().minusDays(7);
        LocalDate dateFin = LocalDate.now();

        when(donRepository.findByDateCreationBetween(dateDebut, dateFin))
                .thenReturn(Arrays.asList(don));
        when(donMapper.toResponse(don)).thenReturn(responseDon);

        List<responseDon> result = donService.findByDateCreationBetween(dateDebut, dateFin);

        assertThat(result).isNotEmpty();
        assertThat(result).hasSize(1);
    }
}