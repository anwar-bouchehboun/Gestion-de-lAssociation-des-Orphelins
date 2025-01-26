package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Activite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;


@Repository
public interface ActiviteRepository extends JpaRepository<Activite, Long> {
    boolean existsByNom(String nom);

    List<Activite> findByNomContaining(String nom);

    List<Activite> findByDateBetween(LocalDate dateDebut, LocalDate dateFin);

    Optional<Activite> findByNom(String nom);
}
