package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.Tuteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TuteurRepository extends JpaRepository<Tuteur, Long> {
        Optional<Tuteur> findByEmail(String email);

        boolean existsByEmail(String email);

        boolean existsByTelephone(String telephone);
}
