package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.dto.request.requestUser;
import com.gestion.orphelins.dto.response.responseUser;
import com.gestion.orphelins.entity.User;
import com.gestion.orphelins.mapper.Usermapper;
import com.gestion.orphelins.repository.UserRepository;
import com.gestion.orphelins.services.interfaces.UserInterface;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import javax.validation.ValidationException;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import com.gestion.orphelins.enums.Roleenum;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class UserService implements UserInterface {

    private final UserRepository userRepository;
    private final Usermapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public responseUser createUser(requestUser request) {
        try {
            // Validation des champs obligatoires
            if (request.getNom() == null || request.getNom().trim().isEmpty()) {
                throw new ValidationException("Le nom est obligatoire");
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                throw new ValidationException("L'email est obligatoire");
            }

            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                throw new ValidationException("Le mot de passe est obligatoire");
            }

            if (request.getRole() == null || request.getRole().trim().isEmpty()) {
                throw new ValidationException("Le rôle est obligatoire");
            }

            // Validation du format de l'email
            if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                throw new ValidationException("Format d'email invalide");
            }

            // Vérification de l'existence de l'email
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new ValidationException("L'email " + request.getEmail() + " existe déjà");
            }

            // Validation de la longueur du mot de passe
            if (request.getPassword().length() < 8) {
                throw new ValidationException("Le mot de passe doit contenir au moins 8 caractères");
            }

            // Validation du rôle
            try {
                Roleenum.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new ValidationException("Le rôle spécifié n'est pas valide. Les rôles valides sont : " +
                        String.join(", ", Arrays.stream(Roleenum.values())
                                .map(Enum::name)
                                .collect(Collectors.toList())));
            }

            // Création de l'utilisateur
            User user = User.builder()
                    .nom(request.getNom())
                    .email(request.getEmail())
                    .motDePasse(passwordEncoder.encode(request.getPassword()))
                    .role(Roleenum.valueOf(request.getRole().toUpperCase()))
                    .isActive(true)
                    .build();

            return userMapper.toResponse(userRepository.save(user));
        } catch (ValidationException e) {
            throw e;
        } catch (Exception e) {
            throw new ValidationException("Erreur lors de la création de l'utilisateur: " + e.getMessage());
        }
    }

    @Override
    public responseUser getUserById(Long id) {
        return userMapper.toResponse(userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé")));
    }

    @Override
    public responseUser getUserByEmail(String email) {
        return userMapper.toResponse(userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé")));
    }

    @Override
    public List<responseUser> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public responseUser updateUser(Long id, requestUser request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé"));

        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setMotDePasse(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            user.setRole(Roleenum.valueOf(request.getRole().toUpperCase()));
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

}
