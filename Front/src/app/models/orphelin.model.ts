export interface Orphelin {
  id?: number;
  nom: string;
  age: number;
  genre: 'Masculin' | 'Feminin';
  etatDeSante: string;
  niveauEducation: string;
  tuteurId: number;
}
