import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Client, CreateClientData, UpdateClientData } from '@/types/client';
import { useToast } from '@/hooks/use-toast';

export const useClientData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les clients',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (clientData: CreateClientData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('clients')
        .insert({
          ...clientData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [data, ...prev]);
      toast({
        title: 'Succès',
        description: 'Client ajouté avec succès',
      });
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le client',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateClient = async (id: string, clientData: UpdateClientData) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === id ? data : client
      ));
      
      toast({
        title: 'Succès',
        description: 'Client mis à jour avec succès',
      });
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le client',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
      toast({
        title: 'Succès',
        description: 'Client supprimé avec succès',
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le client',
        variant: 'destructive',
      });
    }
  };

  const exportClientsCSV = () => {
    const headers = [
      'Nom du Client',
      'Entreprise',
      'Adresse',
      'Date de Début',
      'Type de Contrat',
      'Renouvellement',
      'Montant',
      'Devise',
      'Statut Paiement',
      'Responsable Interne'
    ];

    const csvContent = [
      headers.join(','),
      ...clients.map(client => [
        client.nom_du_client,
        client.entreprise || '',
        client.adresse || '',
        client.date_debut || '',
        client.type_contrat,
        client.renouvellement,
        client.montant_contrat || '',
        client.devise,
        client.statut_paiement,
        client.responsable_interne || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    addClient,
    updateClient,
    deleteClient,
    exportClientsCSV,
    refetch: fetchClients,
  };
};