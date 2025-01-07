package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Activite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Date;
import java.util.List;

@Repository
public interface ActiviteRepository extends JpaRepository<Activite, Long> {
    List<Activite> findByDate(Date date);

    List<Activite> findByNomContaining(String nom);
}
