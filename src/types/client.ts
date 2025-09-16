export interface Client {
  id: string;
  user_id: string;
  nom_du_client: string;
  entreprise?: string;
  adresse?: string;
  date_debut?: string;
  type_contrat: string;
  renouvellement: string;
  montant_contrat?: number;
  devise: string;
  statut_paiement: string;
  responsable_interne?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientData extends Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

export interface UpdateClientData extends Partial<CreateClientData> {}