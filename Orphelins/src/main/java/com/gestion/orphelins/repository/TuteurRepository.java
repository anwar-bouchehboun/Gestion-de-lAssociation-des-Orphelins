package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Tuteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface TuteurRepository extends JpaRepository<Tuteur, Long> {
        Optional<Tuteur> findByEmail(String email);

        boolean existsByEmail(String email);

        boolean existsByTelephone(String telephone);

        Optional<Tuteur> findByNomContaining(String nom);

        Optional<Tuteur> findByTelephone(String telephone);

        @Query("SELECT new map(t.nom as nom, COUNT(o) as count) FROM Tuteur t LEFT JOIN t.orphelins o GROUP BY t.nom")
        List<Map<String, Object>> countOrphelinsParTuteur();
}
