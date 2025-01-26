package com.gestion.orphelins.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;
import java.util.Set;
import java.util.HashSet;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class responseActivite {
    private Long id;
    private String nom;
    private String description;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;
    private double budget;
    @Builder.Default
    private Set<responseOrphelin> participants = new HashSet<>();

}
