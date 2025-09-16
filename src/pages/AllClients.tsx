import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search, Upload, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { useClientData } from '@/hooks/useClientData';

const AllClients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nom_du_client');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const { 
    clients, 
    loading, 
    deleteClient,
    exportClientsCSV 
  } = useClientData();

  const filteredClients = clients.filter(client =>
    client.nom_du_client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.entreprise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.type_contrat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    const aValue = a[sortBy as keyof typeof a] || '';
    const bValue = b[sortBy as keyof typeof b] || '';
    
    if (sortOrder === 'asc') {
      return aValue.toString().localeCompare(bValue.toString());
    }
    return bValue.toString().localeCompare(aValue.toString());
  });

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Clients</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => navigate('/add-client')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter Client
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Clients</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, entreprise ou type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={exportClientsCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exporter CSV
            </Button>
          </div>

          <ClientsTable
            clients={sortedClients}
            loading={loading}
            onSort={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onDelete={deleteClient}
            onEdit={(client) => navigate(`/edit-client/${client.id}`)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AllClients;