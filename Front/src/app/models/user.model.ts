export interface User {
  id?: number;
  nom: string;
  email: string;
  motDePasse: string;
  role: string;
  isActive: boolean;
}

// Énumération pour les rôles possibles
export const ROLES = {
  ADMIN: 'ADMIN',
  GESTIONNAIRE: 'GESTIONNAIRE',
  COLLABORATEUR: 'COLLABORATEUR',
} as const;
