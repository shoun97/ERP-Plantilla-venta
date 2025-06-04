import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import { Client } from '../../types';
import { User, Phone, Mail, FileText } from 'lucide-react';

interface ClientFormProps {
  client?: Client;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onClose }) => {
  const { services, addClient, updateClient } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Client, 'id' | 'createdAt'>>({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    preferredServices: client?.preferredServices || [],
    notes: client?.notes || '',
    lastVisit: client?.lastVisit || null
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      preferredServices: selectedOptions
    });
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(formData.phone) && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Formato inválido. Use: 555-123-4567 o 5551234567';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (client) {
        // Update existing client
        updateClient(client.id, formData);
      } else {
        // Add new client
        addClient(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    // Format as XXX-XXX-XXXX
    if (value.length >= 7) {
      value = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6)}`;
    } else if (value.length >= 4) {
      value = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    
    setFormData({
      ...formData,
      phone: value
    });
    
    if (errors.phone) {
      setErrors({
        ...errors,
        phone: ''
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Nombre"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Nombre completo"
          error={errors.name}
          icon={<User className="w-4 h-4" />}
          required
        />
        
        <Input
          label="Teléfono"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handlePhoneChange}
          placeholder="555-123-4567"
          error={errors.phone}
          icon={<Phone className="w-4 h-4" />}
          required
        />
        
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="ejemplo@correo.com"
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          required
        />
        
        <div>
          <label 
            htmlFor="preferredServices" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Servicios Preferidos
          </label>
          <select
            id="preferredServices"
            name="preferredServices"
            multiple
            value={formData.preferredServices}
            onChange={handleServiceChange}
            className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:border-pink-500 focus:ring-pink-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} (${service.price})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples servicios
          </p>
        </div>
        
        <div>
          <label 
            htmlFor="notes" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notas
          </label>
          <div className="relative">
            <FileText className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-pink-500 focus:ring-pink-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              placeholder="Preferencias, alergias u otra información importante..."
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
          >
            {client ? 'Guardar Cambios' : 'Crear Cliente'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ClientForm;