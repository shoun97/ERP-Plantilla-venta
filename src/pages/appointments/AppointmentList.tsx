import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card, { CardBody, CardHeader } from '../../components/UI/Card';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import Empty from '../../components/UI/Empty';
import Modal from '../../components/UI/Modal';
import { Plus, CalendarDays, Check, X, Clock, Edit, Trash2 } from 'lucide-react';
import AppointmentForm from './AppointmentForm';
import { Appointment } from '../../types';

const AppointmentList: React.FC = () => {
  const { appointments, clients, services, updateAppointment, deleteAppointment } = useData();
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Filter appointments based on status
  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  }).sort((a, b) => {
    // Sort by date (newest first) and then by start time
    const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });

  // Handle appointment edit
  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  // Handle appointment delete
  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteModalOpen(true);
  };

  // Handle status change
  const handleStatusChange = (appointment: Appointment, status: 'scheduled' | 'completed' | 'cancelled') => {
    updateAppointment(appointment.id, { status });
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      deleteAppointment(selectedAppointment.id);
      setIsDeleteModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  // Get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  // Get services by IDs
  const getServiceNames = (serviceIds: string[]) => {
    return serviceIds.map(id => {
      const service = services.find(s => s.id === id);
      return service ? service.name : 'Servicio desconocido';
    }).join(', ');
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Calendario de Citas
        </h1>
        <Button 
          variant="primary" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Nueva Cita
        </Button>
      </div>

      <Card>
        <CardHeader 
          title="Lista de Citas" 
          icon={<CalendarDays className="w-5 h-5" />} 
          action={
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                Todas
              </Button>
              <Button 
                variant={filter === 'scheduled' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('scheduled')}
              >
                Programadas
              </Button>
              <Button 
                variant={filter === 'completed' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completadas
              </Button>
              <Button 
                variant={filter === 'cancelled' ? 'primary' : 'outline'} 
                size="sm"
                onClick={() => setFilter('cancelled')}
              >
                Canceladas
              </Button>
            </div>
          }
        />
        <CardBody className="p-0">
          {filteredAppointments.length > 0 ? (
            <Table>
              <TableHead>
                <TableHeader>Cliente</TableHeader>
                <TableHeader>Fecha y Hora</TableHeader>
                <TableHeader>Servicios</TableHeader>
                <TableHeader>Total</TableHeader>
                <TableHeader>Estado</TableHeader>
                <TableHeader className="text-right">Acciones</TableHeader>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium text-gray-900">
                      {getClientName(appointment.clientId)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {appointment.startTime} - {appointment.endTime}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-xs">
                        {getServiceNames(appointment.serviceIds)}
                      </p>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${appointment.totalAmount}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          appointment.status === 'completed' ? 'success' :
                          appointment.status === 'scheduled' ? 'primary' :
                          'danger'
                        }
                      >
                        {appointment.status === 'completed' ? 'Completada' :
                         appointment.status === 'scheduled' ? 'Programada' :
                         'Cancelada'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {appointment.status === 'scheduled' && (
                          <>
                            <Button 
                              variant="success" 
                              size="sm"
                              icon={<Check className="w-4 h-4" />}
                              onClick={() => handleStatusChange(appointment, 'completed')}
                              title="Marcar como completada"
                            />
                            <Button 
                              variant="danger" 
                              size="sm"
                              icon={<X className="w-4 h-4" />}
                              onClick={() => handleStatusChange(appointment, 'cancelled')}
                              title="Cancelar cita"
                            />
                          </>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          onClick={() => handleEditAppointment(appointment)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDeleteClick(appointment)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Empty 
              title={filter !== 'all' ? `No hay citas ${filter === 'scheduled' ? 'programadas' : filter === 'completed' ? 'completadas' : 'canceladas'}` : "No hay citas"}
              description="Programa tu primera cita para comenzar"
              icon={<CalendarDays className="w-12 h-12" />}
              action={{
                label: "Agregar Cita",
                onClick: () => setIsAddModalOpen(true)
              }}
            />
          )}
        </CardBody>
      </Card>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Programar Nueva Cita"
        size="lg"
      >
        <AppointmentForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Appointment Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cita"
        size="lg"
      >
        {selectedAppointment && (
          <AppointmentForm 
            appointment={selectedAppointment} 
            onClose={() => setIsEditModalOpen(false)} 
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
        size="sm"
        footer={
          <div className="flex justify-end space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={confirmDelete}
            >
              Eliminar
            </Button>
          </div>
        }
      >
        <p>
          ¿Estás seguro que deseas eliminar esta cita?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </>
  );
};

export default AppointmentList;