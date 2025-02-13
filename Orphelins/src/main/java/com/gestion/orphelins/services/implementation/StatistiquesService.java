package com.gestion.orphelins.services.implementation;

import com.gestion.orphelins.repository.*;
import com.gestion.orphelins.services.interfaces.StatistiquesInterface;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class StatistiquesService implements StatistiquesInterface {

    private final OrphelinRepository orphelinRepository;
    private final TuteurRepository tuteurRepository;
    private final DonRepository donRepository;
    private final ActiviteRepository activiteRepository;

    @Override
    public Map<String, Object> genererStatistiquesGlobales() {
        Map<String, Object> statistiques = new HashMap<>();

        try {
            // Statistiques de base
            Long totalOrphelins = orphelinRepository.count();
            Long totalTuteurs = tuteurRepository.count();
            Long totalDons = donRepository.count();
            Long totalActivites = activiteRepository.count();

            statistiques.put("totalOrphelins", totalOrphelins);
            statistiques.put("totalTuteurs", totalTuteurs);
            statistiques.put("totalDons", totalDons);
            statistiques.put("totalActivites", totalActivites);

            // Statistiques par genre (avec valeur par défaut à 0 si null)
            Long femmes = orphelinRepository.countByGenre("Feminin");
            Long hommes = orphelinRepository.countByGenre("Masculin");
            statistiques.put("orphelinsFemmes", femmes != null ? femmes : 0L);
            statistiques.put("orphelinsHommes", hommes != null ? hommes : 0L);

            // Montant total des dons (avec valeur par défaut à 0 si null)
            Double montantTotal = donRepository.calculerMontantTotal();
            statistiques.put("montantTotalDons", montantTotal != null ? montantTotal : 0.0);

            // Ajout du montant total des activités
            Double montantTotalActivites = activiteRepository.calculerMontantTotalActivites();
            statistiques.put("montantTotalActivites", montantTotalActivites != null ? montantTotalActivites : 0.0);

            // Statistiques des orphelins par tuteur
            List<Map<String, Object>> orphelinsList = tuteurRepository.countOrphelinsParTuteur();
            Map<String, Long> orphelinsParTuteur = orphelinsList.stream()
                    .collect(Collectors.toMap(
                            m -> (String) m.get("nom"),
                            m -> ((Number) m.get("count")).longValue()));
            statistiques.put("orphelinsParTuteur", orphelinsParTuteur);

            // Statistiques des activités par mois
            List<Map<String, Object>> activitesList = activiteRepository.countActiviteParMois();
            Map<String, Long> activitesParMois = new HashMap<>();

            String[] moisFr = { "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre" };

            // Initialiser tous les mois à 0
            for (String mois : moisFr) {
                activitesParMois.put(mois, 0L);
            }

            // Mettre à jour avec les données réelles
            activitesList.forEach(m -> {
                Integer moisNum = ((Number) m.get("mois")).intValue();
                Long count = ((Number) m.get("count")).longValue();
                activitesParMois.put(moisFr[moisNum - 1], count);
            });

            statistiques.put("activitesParMois", activitesParMois);

        } catch (Exception e) {
            // En cas d'erreur, on retourne au moins les statistiques de base
            statistiques.put("error", "Erreur lors de la génération des statistiques: " + e.getMessage());
        }

        return statistiques;
    }
}
