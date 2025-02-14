package com.gestion.orphelins.services.interfaces;

import com.gestion.orphelins.dto.request.requestUser;
import com.gestion.orphelins.dto.response.responseUser;
import java.util.List;

public interface UserInterface {
    responseUser createUser(requestUser request);

    responseUser getUserById(Long id);

    responseUser getUserByEmail(String email);

    List<responseUser> getAllUsers();

    responseUser updateUser(Long id, requestUser request);

    void deleteUser(Long id);

}
