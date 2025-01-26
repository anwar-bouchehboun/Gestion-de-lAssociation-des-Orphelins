package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Orphelin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrphelinRepository extends JpaRepository<Orphelin, Long> {
    List<Orphelin> findByTuteurId(Long tuteurId);

    // List<Orphelin> findByNomContaining(String nom);

    List<Orphelin> findByAge(int age);

    List<Orphelin> findByGenre(String genre);

    boolean existsByNom(String nom);

    Optional<Orphelin> findByNom(String nom);

    List<Orphelin> findByNomContaining(String nom);

    List<Orphelin> findByNomContainingIgnoreCase(String nom);
}
