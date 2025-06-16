
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon, Plus, Edit, Trash2, Check, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SettingsSectionProps {
  title: string;
  items: string[];
  newValue: string;
  setNewValue: (value: string) => void;
  onAdd: () => void;
  onRemove: (item: string) => void;
  totalCount: number;
  placeholder: string;
  type: string;
  editingItem: { type: string; oldValue: string; newValue: string } | null;
  onStartEditing: (type: string, value: string) => void;
  onCancelEditing: () => void;
  onSaveEdit: () => void;
  onEditInputChange: (value: string) => void;
}

export const SettingsSection = ({
  title,
  items,
  newValue,
  setNewValue,
  onAdd,
  onRemove,
  totalCount,
  placeholder,
  type,
  editingItem,
  onStartEditing,
  onCancelEditing,
  onSaveEdit,
  onEditInputChange
}: SettingsSectionProps) => {
  const { t } = useLanguage();

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <SettingsIcon className="mr-2 h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add new item */}
        <div className="flex space-x-2">
          <Input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd();
              }
            }}
            className="text-xs h-8"
          />
          <Button onClick={onAdd} size="sm" className="bg-blue-600 hover:bg-blue-700 px-2 h-8">
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* List items - increased height to show up to 15 items */}
        <div className="space-y-1 max-h-[480px] overflow-y-auto">
          {items.map((item, index) => (
            <div key={`${item}-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              {editingItem && editingItem.type === type && editingItem.oldValue === item ? (
                <div className="flex items-center space-x-2 flex-1">
                  <Input
                    value={editingItem.newValue}
                    onChange={(e) => onEditInputChange(e.target.value)}
                    className="text-xs h-6"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onSaveEdit();
                      } else if (e.key === 'Escape') {
                        onCancelEditing();
                      }
                    }}
                    autoFocus
                  />
                  <Button variant="ghost" size="sm" onClick={onSaveEdit} className="h-5 w-5 p-0">
                    <Check className="h-2 w-2 text-green-500" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onCancelEditing} className="h-5 w-5 p-0">
                    <X className="h-2 w-2 text-red-500" />
                  </Button>
                </div>
              ) : (
                <>
                  <span className="font-medium">{item}</span>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onStartEditing(type, item)}
                      className="h-5 w-5 p-0"
                    >
                      <Edit className="h-2 w-2 text-gray-500" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onRemove(item)}
                      className="h-5 w-5 p-0"
                    >
                      <Trash2 className="h-2 w-2 text-red-500" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500">
          {t('settings.totalItems').replace('{count}', totalCount.toString())}
        </p>
      </CardContent>
    </Card>
  );
};
