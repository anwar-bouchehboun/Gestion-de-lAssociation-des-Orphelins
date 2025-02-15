export interface Activite {
  id?: number;
  nom: string;
  description: string;
  date: Date;
  budget: number;
  participantsIds: number[];
}
