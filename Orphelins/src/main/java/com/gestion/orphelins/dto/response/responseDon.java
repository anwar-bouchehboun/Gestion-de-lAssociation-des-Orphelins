package com.gestion.orphelins.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import lombok.Builder;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class responseDon {
    private Long id;
    private String nomDonateur;
    private double montant;
    private String objectif;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
}
