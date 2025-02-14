package com.gestion.orphelins.services.implementation;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;
import com.gestion.orphelins.entity.User;
import java.util.Collections;

public class UserInfoDetails implements UserDetails {

    private String username;
    private String password; // Utilisé pour stocker le mot de passe
    private List<GrantedAuthority> authorities;

    public UserInfoDetails(User userInfo) {
        this.username=userInfo.getNom();
        this.password = userInfo.getMotDePasse();
        this.authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + userInfo.getRole().name()));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }


    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
