package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Qualifier;

@Service
@Qualifier("AuthenticationService")
@RequiredArgsConstructor
public class AuthenticationService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .map(UserInfoDetails::new)
                .orElseThrow(
                        () -> new UsernameNotFoundException("L'utilisateur avec l'email " + email + " Aucun Idee"));
    }
}