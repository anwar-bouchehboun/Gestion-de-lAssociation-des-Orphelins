export interface UserUpdate {
  nom: string;
  email: string;
  role: string;
}

// Constantes pour les rôles disponibles
export const ROLES = {
  ADMIN: 'ADMIN',
  GESTIONNAIRE: 'GESTIONNAIRE',
  COLLABORATEUR: 'COLLABORATEUR',
} as const;
