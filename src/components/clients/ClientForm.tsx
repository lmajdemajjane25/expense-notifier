import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useConfiguration } from '@/contexts/ConfigurationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CreateClientData, Client } from '@/types/client';

const clientSchema = z.object({
  nom_du_client: z.string().min(1, 'Le nom du client est requis'),
  entreprise: z.string().optional(),
  adresse: z.string().optional(),
  date_debut: z.string().optional(),
  type_contrat: z.enum(['Standard', 'Premium', 'Custom']),
  renouvellement: z.enum(['Mois', 'Trimestre', '6 mois', '1 an']),
  montant_contrat: z.coerce.number().positive().optional(),
  devise: z.string().default('EUR'),
  statut_paiement: z.enum(['Paid', 'Pending', 'Overdue']),
  responsable_interne: z.string().optional(),
});

interface ClientFormProps {
  client?: Client;
  onSubmit: (data: CreateClientData) => Promise<void>;
}

export const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit }) => {
  const { currencies, contractTypes, renewalFrequencies, paymentStatuses } = useConfiguration();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [dateDebut, setDateDebut] = React.useState<Date | undefined>(
    client?.date_debut ? new Date(client.date_debut) : undefined
  );

  const form = useForm<CreateClientData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nom_du_client: client?.nom_du_client || '',
      entreprise: client?.entreprise || '',
      adresse: client?.adresse || '',
      date_debut: client?.date_debut || '',
      type_contrat: client?.type_contrat || 'Standard',
      renouvellement: client?.renouvellement || 'Mois',
      montant_contrat: client?.montant_contrat || undefined,
      devise: client?.devise || 'EUR',
      statut_paiement: client?.statut_paiement || 'Pending',
      responsable_interne: client?.responsable_interne || '',
    },
  });

  const handleSubmit = async (data: CreateClientData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        date_debut: dateDebut ? format(dateDebut, 'yyyy-MM-dd') : undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nom_du_client">Nom du Client *</Label>
          <Input
            id="nom_du_client"
            {...form.register('nom_du_client')}
            placeholder="Nom du client"
          />
          {form.formState.errors.nom_du_client && (
            <p className="text-sm text-destructive">{form.formState.errors.nom_du_client.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="entreprise">Entreprise</Label>
          <Input
            id="entreprise"
            {...form.register('entreprise')}
            placeholder="Nom de l'entreprise"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="adresse">Adresse</Label>
          <Input
            id="adresse"
            {...form.register('adresse')}
            placeholder="Adresse complète"
          />
        </div>

        <div className="space-y-2">
          <Label>Date de Début</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateDebut && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateDebut ? format(dateDebut, "PPP", { locale: fr }) : "Sélectionner une date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateDebut}
                onSelect={setDateDebut}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Type de Contrat</Label>
          <Select
            value={form.watch('type_contrat')}
            onValueChange={(value: 'Standard' | 'Premium' | 'Custom') => 
              form.setValue('type_contrat', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner le type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Renouvellement</Label>
          <Select
            value={form.watch('renouvellement')}
            onValueChange={(value: 'Mois' | 'Trimestre' | '6 mois' | '1 an') => 
              form.setValue('renouvellement', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Fréquence de renouvellement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mois">Mois</SelectItem>
              <SelectItem value="Trimestre">Trimestre</SelectItem>
              <SelectItem value="6 mois">6 mois</SelectItem>
              <SelectItem value="1 an">1 an</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="montant_contrat">Montant du Contrat</Label>
          <Input
            id="montant_contrat"
            type="number"
            step="0.01"
            {...form.register('montant_contrat')}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label>Devise</Label>
          <Select
            value={form.watch('devise')}
            onValueChange={(value) => form.setValue('devise', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Devise" />
            </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                  ))}
                </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Statut de Paiement</Label>
          <Select
            value={form.watch('statut_paiement')}
            onValueChange={(value: 'Paid' | 'Pending' | 'Overdue') => 
              form.setValue('statut_paiement', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut de paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Paid">Payé</SelectItem>
              <SelectItem value="Pending">En attente</SelectItem>
              <SelectItem value="Overdue">En retard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="responsable_interne">Responsable Interne</Label>
          <Input
            id="responsable_interne"
            {...form.register('responsable_interne')}
            placeholder="Nom du responsable"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'En cours...' : client ? 'Mettre à jour' : 'Ajouter le Client'}
      </Button>
    </form>
  );
};