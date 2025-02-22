export interface Statistiques {
  totalOrphelins: number;
  totalTuteurs: number;
  totalActivites: number;
  montantTotalActivites: number;
  totalDons: number;
  orphelinsHommes: number;
  orphelinsFemmes: number;
  montantTotalDons: number;
  activitesParMois: { [mois: string]: number };
  orphelinsParTuteur: { [nomTuteur: string]: number };
}
