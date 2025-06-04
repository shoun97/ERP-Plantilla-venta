import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { Service } from '../../types';
import { FileText, DollarSign, Clock } from 'lucide-react';

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
  categories: string[];
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose, categories }) => {
  const { addService, updateService } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: service?.name || '',
    description: service?.description || '',
    duration: service?.duration || 30,
    price: service?.price || 0,
    category: service?.category || (categories.length > 0 ? categories[0] : '')
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle number inputs
    if (name === 'duration' || name === 'price') {
      const numValue = name === 'price' 
        ? parseFloat(value) 
        : parseInt(value, 10);
      
      setFormData({
        ...formData,
        [name]: numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'new') {
      setShowNewCategoryInput(true);
    } else {
      setFormData({
        ...formData,
        category: value
      });
    }
  };
  
  const handleNewCategorySubmit = () => {
    if (newCategory.trim()) {
      setFormData({
        ...formData,
        category: newCategory.trim()
      });
      setShowNewCategoryInput(false);
      setNewCategory('');
    }
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    
    if (!formData.duration || formData.duration <= 0) {
      newErrors.duration = 'La duración debe ser mayor a 0';
    }
    
    if (formData.price < 0) {
      newErrors.price = 'El precio no puede ser negativo';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida';
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
      if (service) {
        // Update existing service
        updateService(service.id, formData);
      } else {
        // Add new service
        addService(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Nombre del Servicio"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej. Manicura Básica"
          error={errors.name}
          required
        />
        
        <div>
          <label 
            htmlFor="description" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <div className="relative">
            <FileText className="absolute top-3 left-3 w-4 h-4 text-gray-400" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-pink-500 focus:ring-pink-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
              placeholder="Descripción breve del servicio..."
              required
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="duration" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Duración (minutos)
            </label>
            <div className="relative">
              <Clock className="absolute top-1/2 left-3 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min={5}
                step={5}
                className={`
                  w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4
                  ${errors.duration ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-pink-500 focus:ring-pink-500'}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                `}
                required
              />
            </div>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
            )}
          </div>
          
          <div>
            <label 
              htmlFor="price" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Precio
            </label>
            <div className="relative">
              <DollarSign className="absolute top-1/2 left-3 w-4 h-4 text-gray-400 transform -translate-y-1/2" />
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min={0}
                step={5}
                className={`
                  w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4
                  ${errors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-pink-500 focus:ring-pink-500'}
                  focus:outline-none focus:ring-2 focus:ring-opacity-50
                `}
                required
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>
        </div>
        
        {showNewCategoryInput ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nueva Categoría
            </label>
            <div className="flex space-x-2">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleNewCategorySubmit}
                disabled={!newCategory.trim()}
              >
                Agregar
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setShowNewCategoryInput(false);
                  setFormData({
                    ...formData,
                    category: categories.length > 0 ? categories[0] : ''
                  });
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <label 
              htmlFor="category" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Categoría
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleCategoryChange}
              className={`
                w-full rounded-lg border border-gray-300 py-2 px-4
                ${errors.category ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-pink-500 focus:ring-pink-500'}
                focus:outline-none focus:ring-2 focus:ring-opacity-50
              `}
              required
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="new">+ Agregar nueva categoría</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category}</p>
            )}
          </div>
        )}
        
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
            {service ? 'Guardar Cambios' : 'Crear Servicio'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default ServiceForm;