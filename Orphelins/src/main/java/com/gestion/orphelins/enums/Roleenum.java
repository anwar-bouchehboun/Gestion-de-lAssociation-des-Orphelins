package com.gestion.orphelins.enums;

public enum Roleenum {
    ADMIN,
    GESTIONNAIRE,
    COLLABORATEUR;

    public String getAuthority() {
        return "ROLE_" + this.name();
    }
}
