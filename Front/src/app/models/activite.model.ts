import { Orphelin } from './orphelin.model';
export interface Activite {
  id?: number;
  nom: string;
  description: string;
  date: string;
  budget: number;
  participants: Orphelin[];
  participantsIds: number[];
}
