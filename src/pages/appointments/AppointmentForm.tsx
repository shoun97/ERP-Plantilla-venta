import React, { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
import Select from '../../components/UI/Select';
import { Appointment, Service } from '../../types';
import { format, addMinutes, parse } from 'date-fns';

interface AppointmentFormProps {
  appointment?: Appointment;
  onClose: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ appointment, onClose }) => {
  const { clients, services, employees, addAppointment, updateAppointment } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<Omit<Appointment, 'id'>>({
    clientId: appointment?.clientId || (clients.length > 0 ? clients[0].id : ''),
    date: appointment?.date || format(new Date(), 'yyyy-MM-dd'),
    startTime: appointment?.startTime || '10:00',
    endTime: appointment?.endTime || '11:00',
    serviceIds: appointment?.serviceIds || [],
    status: appointment?.status || 'scheduled',
    totalAmount: appointment?.totalAmount || 0,
    notes: appointment?.notes || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(employees.length > 0 ? employees[0].id : '');
  
  // Calculate end time based on selected services and start time
  useEffect(() => {
    if (formData.serviceIds.length > 0 && formData.startTime) {
      // Calculate total duration
      const totalDuration = formData.serviceIds.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service ? service.duration : 0);
      }, 0);
      
      // Calculate total amount
      const totalAmount = formData.serviceIds.reduce((total, serviceId) => {
        const service = services.find(s => s.id === serviceId);
        return total + (service ? service.price : 0);
      }, 0);
      
      // Calculate end time
      const startTime = parse(formData.startTime, 'HH:mm', new Date());
      const endTime = addMinutes(startTime, totalDuration);
      
      setFormData({
        ...formData,
        endTime: format(endTime, 'HH:mm'),
        totalAmount
      });
    }
  }, [formData.serviceIds, formData.startTime, services]);
  
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
      serviceIds: selectedOptions
    });
  };
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.clientId) {
      newErrors.clientId = 'El cliente es requerido';
    }
    
    if (!formData.date) {
      newErrors.date = 'La fecha es requerida';
    }
    
    if (!formData.startTime) {
      newErrors.startTime = 'La hora de inicio es requerida';
    }
    
    if (formData.serviceIds.length === 0) {
      newErrors.serviceIds = 'Al menos un servicio es requerido';
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
      if (appointment) {
        // Update existing appointment
        updateAppointment(appointment.id, formData);
      } else {
        // Add new appointment
        addAppointment(formData);
        
        // Update employee's appointment list (would be implemented in a real app)
        // updateEmployee(selectedEmployeeId, { 
        //   appointmentIds: [...employee.appointmentIds, newAppointmentId] 
        // });
      }
      onClose();
    } catch (error) {
      console.error('Error saving appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Group services by category for better organization
  const groupedServices: Record<string, Service[]> = {};
  services.forEach(service => {
    if (!groupedServices[service.category]) {
      groupedServices[service.category] = [];
    }
    groupedServices[service.category].push(service);
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Select
          label="Cliente"
          id="clientId"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          options={clients.map(client => ({
            value: client.id,
            label: client.name
          }))}
          error={errors.clientId}
          required
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha"
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={errors.date}
            required
          />
          
          <Input
            label="Hora de Inicio"
            id="startTime"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleChange}
            error={errors.startTime}
            required
          />
        </div>
        
        <div>
          <label 
            htmlFor="serviceIds" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Servicios
          </label>
          <select
            id="serviceIds"
            name="serviceIds"
            multiple
            value={formData.serviceIds}
            onChange={handleServiceChange}
            className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:border-pink-500 focus:ring-pink-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ height: '150px' }}
          >
            {Object.entries(groupedServices).map(([category, categoryServices]) => (
              <optgroup key={category} label={category}>
                {categoryServices.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - ${service.price} ({service.duration} min)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.serviceIds && (
            <p className="mt-1 text-sm text-red-600">{errors.serviceIds}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples servicios
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Empleado Asignado"
            id="employeeId"
            name="employeeId"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            options={employees.map(employee => ({
              value: employee.id,
              label: employee.name
            }))}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resumen
            </label>
            <div className="rounded-lg border border-gray-300 bg-gray-50 p-3">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Duración Total:</span>
                <span className="text-sm font-medium">
                  {formData.serviceIds.reduce((total, serviceId) => {
                    const service = services.find(s => s.id === serviceId);
                    return total + (service ? service.duration : 0);
                  }, 0)} minutos
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">Hora de Fin:</span>
                <span className="text-sm font-medium">{formData.endTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total a Pagar:</span>
                <span className="text-sm font-medium">${formData.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <label 
            htmlFor="notes" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notas
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={2}
            className="w-full rounded-lg border border-gray-300 py-2 px-4 focus:border-pink-500 focus:ring-pink-500 focus:outline-none focus:ring-2 focus:ring-opacity-50"
            placeholder="Notas adicionales sobre la cita..."
          />
        </div>
        
        {appointment && (
          <Select
            label="Estado"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'scheduled', label: 'Programada' },
              { value: 'completed', label: 'Completada' },
              { value: 'cancelled', label: 'Cancelada' }
            ]}
          />
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
            {appointment ? 'Guardar Cambios' : 'Programar Cita'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AppointmentForm;