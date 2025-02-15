package com.gestion.orphelins.services.interfaces;

import com.gestion.orphelins.dto.request.requestUser;
import com.gestion.orphelins.dto.response.responseUser;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.gestion.orphelins.dto.request.PasswordUpdateRequest;
import com.gestion.orphelins.dto.request.UserUpdateRequest;

public interface UserInterface {
    responseUser createUser(requestUser request);

    responseUser getUserById(Long id);

    responseUser getUserByEmail(String email);

    List<responseUser> getAllUsers();

    Page<responseUser> getAllUsers(Pageable pageable);

    responseUser updateUser(Long id, requestUser request);

    void deleteUser(Long id);

    void updatePassword(Long id, PasswordUpdateRequest request);

    responseUser updateUser(Long id, UserUpdateRequest request);

    List<responseUser> getAllUsersByNom(String nom);
}
