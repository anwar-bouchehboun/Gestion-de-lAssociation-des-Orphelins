package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Activite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;
import java.util.Optional;
import java.util.Map;

@Repository
public interface ActiviteRepository extends JpaRepository<Activite, Long> {
    boolean existsByNom(String nom);

    List<Activite> findByNomContaining(String nom);

    List<Activite> findByDateBetween(LocalDate dateDebut, LocalDate dateFin);

    Optional<Activite> findByNom(String nom);

    @Query("SELECT MONTH(a.date) as mois, COUNT(a) as count FROM Activite a GROUP BY MONTH(a.date)")
    List<Map<String, Object>> countActiviteParMois();

    @Query("SELECT COALESCE(SUM(a.budget), 0) FROM Activite a")
    Double calculerMontantTotalActivites();

}
