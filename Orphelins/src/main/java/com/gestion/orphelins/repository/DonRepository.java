package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Don;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface DonRepository extends JpaRepository<Don, Long> {
    List<Don> findByDateCreation(LocalDate dateCreation);

    List<Don> findByNomDonateurContaining(String nomDonateur);

    List<Don> findByDateCreationBetween(LocalDate dateDebut, LocalDate dateFin);
}
