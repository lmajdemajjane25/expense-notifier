import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Client } from '@/types/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onDelete: (id: string) => void;
  onEdit: (client: Client) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  loading,
  onSort,
  sortBy,
  sortOrder,
  onDelete,
  onEdit,
}) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Overdue':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'Payé';
      case 'Pending':
        return 'En attente';
      case 'Overdue':
        return 'En retard';
      default:
        return status;
    }
  };

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      onClick={() => onSort(field)}
      className="h-auto p-0 font-semibold hover:bg-transparent"
    >
      {children}
      {sortBy === field && (
        sortOrder === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  );

  if (loading) {
    return <div className="text-center py-8">Chargement des clients...</div>;
  }

  if (clients.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Aucun client trouvé</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortHeader field="nom_du_client">Nom du Client</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="entreprise">Entreprise</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="type_contrat">Type de Contrat</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="renouvellement">Renouvellement</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="montant_contrat">Montant</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="statut_paiement">Statut</SortHeader>
            </TableHead>
            <TableHead>
              <SortHeader field="date_debut">Date de Début</SortHeader>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id}>
              <TableCell className="font-medium">{client.nom_du_client}</TableCell>
              <TableCell>{client.entreprise || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline">{client.type_contrat}</Badge>
              </TableCell>
              <TableCell>{client.renouvellement}</TableCell>
              <TableCell>
                {client.montant_contrat ? 
                  `${client.montant_contrat.toLocaleString()} ${client.devise}` : 
                  '-'
                }
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(client.statut_paiement)}>
                  {getStatusLabel(client.statut_paiement)}
                </Badge>
              </TableCell>
              <TableCell>
                {client.date_debut ? 
                  format(new Date(client.date_debut), 'dd/MM/yyyy', { locale: fr }) : 
                  '-'
                }
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(client)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(client.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};