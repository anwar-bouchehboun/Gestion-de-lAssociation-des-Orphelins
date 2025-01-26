package com.gestion.orphelins.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import javax.validation.constraints.*;

import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class requestActivite {
    @NotBlank(message = "Le nom est obligatoire")
    private String nom;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "La date est obligatoire")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull(message = "Le budget est obligatoire")
    @Positive(message = "Le budget doit être positif")
    private double budget;

    private Set<Long> participantsIds = new HashSet<>();
}
