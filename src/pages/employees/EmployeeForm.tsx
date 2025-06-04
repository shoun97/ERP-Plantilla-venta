import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import { Employee } from '../../types';
import { User } from 'lucide-react';

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose }) => {
  const { addEmployee, updateEmployee } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Employee, 'id'>>({
    name: employee?.name || '',
    position: employee?.position || '',
    appointmentIds: employee?.appointmentIds || []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'El puesto es requerido';
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
      if (employee) {
        // Update existing employee
        updateEmployee(employee.id, formData);
      } else {
        // Add new employee
        addEmployee(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setIsSubmitting(false);
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
        
        <div>
          <label 
            htmlFor="position" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Puesto
          </label>
          <select
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`
              w-full rounded-lg border border-gray-300 py-2 px-4
              ${errors.position ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'focus:border-pink-500 focus:ring-pink-500'}
              focus:outline-none focus:ring-2 focus:ring-opacity-50
            `}
            required
          >
            <option value="">Seleccionar puesto</option>
            <option value="Manicurista Junior">Manicurista Junior</option>
            <option value="Manicurista Senior">Manicurista Senior</option>
            <option value="Especialista en Uñas Acrílicas">Especialista en Uñas Acrílicas</option>
            <option value="Manicurista y Pedicurista">Manicurista y Pedicurista</option>
            <option value="Estilista de Uñas">Estilista de Uñas</option>
            <option value="Gerente">Gerente</option>
            <option value="Recepcionista">Recepcionista</option>
          </select>
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position}</p>
          )}
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
            {employee ? 'Guardar Cambios' : 'Crear Empleado'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EmployeeForm;