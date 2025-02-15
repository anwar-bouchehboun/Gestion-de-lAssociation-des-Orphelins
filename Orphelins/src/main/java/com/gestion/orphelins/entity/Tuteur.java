package com.gestion.orphelins.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import javax.persistence.OneToMany;
import javax.persistence.CascadeType;
import java.util.List;
import java.util.ArrayList;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import javax.persistence.Table;
import lombok.Builder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
@Table(name = "tuteurs")
public class Tuteur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    @Column(nullable = false)
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @Column(nullable = false, unique = true)
    @NotBlank(message = "Le CIN est obligatoire")
    private String cin;

    @Column(nullable = false, unique = true)
    @Email(message = "Format d'email invalide")
    @NotBlank(message = "L'email est obligatoire")
    private String email;

    @Column(nullable = false)
    @Pattern(regexp = "^(0|\\+212)[5-7][0-9]{8}$", message = "Le numéro de téléphone doit être au format marocain")
    @NotBlank(message = "Le téléphone est obligatoire")
    private String telephone;

    @Column(nullable = false)
    @NotBlank(message = "La relation est obligatoire")
    @Size(max = 255, message = "La relation ne doit pas dépasser 255 caractères")
    private String relation;

    @OneToMany(mappedBy = "tuteur", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Orphelin> orphelins = new ArrayList<>();

    @Override
    public String toString() {
        return "Tuteur [id=" + id +
                ", nom=" + nom +
                ", nombreOrphelins=" + (orphelins != null ? orphelins.size() : 0) + "]";
    }
}
