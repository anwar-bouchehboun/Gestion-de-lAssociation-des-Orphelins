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

import java.util.List;
import java.util.stream.Collectors;
import com.gestion.orphelins.enums.Roleenum;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.gestion.orphelins.dto.request.PasswordUpdateRequest;
import com.gestion.orphelins.dto.request.UserUpdateRequest;
import com.gestion.orphelins.validation.NotFoundExceptionHndler;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService implements UserInterface {

    private final UserRepository userRepository;
    private final Usermapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public responseUser createUser(requestUser request) {
        // Vérifier si l'email existe déjà
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("L'email existe déjà");
        }

        try {
            log.info("Création d'un utilisateur avec les informations suivantes: {}", request);

            User user = userMapper.toEntity(request);

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
                .orElseThrow(() -> new NotFoundExceptionHndler("Utilisateur non trouvé")));
    }

    @Override
    public responseUser getUserByEmail(String email) {
        return userMapper.toResponse(userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundExceptionHndler("Utilisateur non trouvé")));
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
                .orElseThrow(() -> new NotFoundExceptionHndler("Utilisateur non trouvé"));

        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        if (request.getMotDePasse() != null && !request.getMotDePasse().isEmpty()) {
            user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        }
        if (request.getRole() != null && !request.getRole().isEmpty()) {
            user.setRole(Roleenum.valueOf(request.getRole().toUpperCase()));
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new NotFoundExceptionHndler("Utilisateur non trouvé");
        }
        userRepository.deleteById(id);
    }

    @Override
    public Page<responseUser> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(userMapper::toResponse);
    }

    @Override
    public void updatePassword(Long id, PasswordUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Utilisateur non trouvé"));
        user.setMotDePasse(passwordEncoder.encode(request.getMotDePasse()));
        userRepository.save(user);
    }

    @Override
    public responseUser updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new NotFoundExceptionHndler("Utilisateur non trouvé"));
        user.setNom(request.getNom());
        user.setEmail(request.getEmail());
        user.setRole(Roleenum.valueOf(request.getRole().toUpperCase()));
        return userMapper.toResponse(userRepository.save(user));
    }

}
