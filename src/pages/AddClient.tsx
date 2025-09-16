import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ClientForm } from '@/components/clients/ClientForm';
import { useClientData } from '@/hooks/useClientData';
import { CreateClientData } from '@/types/client';

const AddClient = () => {
  const navigate = useNavigate();
  const { addClient } = useClientData();

  const handleSubmit = async (data: CreateClientData) => {
    await addClient(data);
    navigate('/clients');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/clients')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Ajouter un Client</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations du Client</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddClient;