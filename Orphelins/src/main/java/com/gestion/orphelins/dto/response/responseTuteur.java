package com.gestion.orphelins.dto.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class responseTuteur {
    private Long id;
    private String nom;
    private String cin;
    private String email;
    private String telephone;
    private String relation;
    private List<responseOrphelin> orphelins;
}
