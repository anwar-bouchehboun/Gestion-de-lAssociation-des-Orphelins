package com.gestion.orphelins.repository;

import com.gestion.orphelins.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    List<User> findByRole(String role);

    Boolean existsByIsActive(boolean isActive);

    List<User> findByNomContainingIgnoreCase(String nom);
}
