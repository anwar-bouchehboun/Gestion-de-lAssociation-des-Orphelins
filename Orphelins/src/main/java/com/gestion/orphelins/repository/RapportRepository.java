package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {
    List<Rapport> findByDate(LocalDate date);

    List<Rapport> findByTypeContaining(String type);

    List<Rapport> findByDateBetween(LocalDate dateDebut, LocalDate dateFin);
}
