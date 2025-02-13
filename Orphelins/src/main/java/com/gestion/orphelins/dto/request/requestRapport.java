package com.gestion.orphelins.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.AssertTrue;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class requestRapport {
    @NotBlank(message = "Le type est obligatoire")
    private String type;

    @NotBlank(message = "Le contenu ne peut pas être vide")
    private String contenu;

    @NotBlank(message = "La description ne peut pas être vide")
    private String description;

    @NotNull(message = "La date est obligatoire")
    @AssertTrue(message = "La date doit être aujourd'hui")
    private boolean isDateValid() {
        return date != null && date.isEqual(LocalDate.now());
    }

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

   
}
