package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Orphelin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrphelinRepository extends JpaRepository<Orphelin, Long> {
    List<Orphelin> findByTuteurId(Long tuteurId);
    List<Orphelin> findByNomContaining(String nom, String prenom);
    List<Orphelin> findByAge(int age);

    List<Orphelin> findByGenre(String genre);
}
