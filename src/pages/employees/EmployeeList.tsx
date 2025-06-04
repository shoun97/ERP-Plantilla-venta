import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card, { CardBody, CardHeader } from '../../components/UI/Card';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import Empty from '../../components/UI/Empty';
import Modal from '../../components/UI/Modal';
import { Plus, Search, UserCircle, Edit, Trash2, Calendar } from 'lucide-react';
import EmployeeForm from './EmployeeForm';
import { Employee } from '../../types';

const EmployeeList: React.FC = () => {
  const { employees, deleteEmployee, appointments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  // Filter employees based on search query
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle employee edit
  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  // Handle employee delete
  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedEmployee) {
      deleteEmployee(selectedEmployee.id);
      setIsDeleteModalOpen(false);
      setSelectedEmployee(null);
    }
  };

  // Count completed appointments for employee
  const getCompletedAppointmentsCount = (employeeId: string) => {
    const completedAppointments = appointments.filter(appointment => 
      appointment.status === 'completed' && 
      employees.find(e => e.id === employeeId)?.appointmentIds.includes(appointment.id)
    );
    return completedAppointments.length;
  };

  // Calculate total earnings for employee
  const getTotalEarnings = (employeeId: string) => {
    const completedAppointments = appointments.filter(appointment => 
      appointment.status === 'completed' && 
      employees.find(e => e.id === employeeId)?.appointmentIds.includes(appointment.id)
    );
    return completedAppointments.reduce((total, appointment) => total + appointment.totalAmount, 0);
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Equipo de Trabajo
        </h1>
        <Button 
          variant="primary" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Nuevo Empleado
        </Button>
      </div>

      <Card>
        <CardHeader 
          title="Lista de Empleados" 
          icon={<UserCircle className="w-5 h-5" />} 
          action={
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar empleado..."
                className="pl-9 py-1.5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          }
        />
        <CardBody className="p-0">
          {filteredEmployees.length > 0 ? (
            <Table>
              <TableHead>
                <TableHeader>Nombre</TableHeader>
                <TableHeader>Puesto</TableHeader>
                <TableHeader>Citas Completadas</TableHeader>
                <TableHeader>Ingresos Generados</TableHeader>
                <TableHeader className="text-right">Acciones</TableHeader>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium text-gray-900">
                      {employee.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          employee.position.includes('Senior') ? 'primary' :
                          employee.position.includes('Especialista') ? 'success' :
                          'default'
                        }
                      >
                        {employee.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1.5" />
                        {getCompletedAppointmentsCount(employee.id)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      ${getTotalEarnings(employee.id)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          onClick={() => handleEditEmployee(employee)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDeleteClick(employee)}
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
              title={searchQuery ? "No se encontraron resultados" : "No hay empleados"}
              description={searchQuery 
                ? "Intenta con otra búsqueda" 
                : "Agrega tu primer empleado para comenzar"
              }
              icon={<UserCircle className="w-12 h-12" />}
              action={{
                label: "Agregar Empleado",
                onClick: () => setIsAddModalOpen(true)
              }}
            />
          )}
        </CardBody>
      </Card>

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agregar Nuevo Empleado"
        size="lg"
      >
        <EmployeeForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Empleado"
        size="lg"
      >
        {selectedEmployee && (
          <EmployeeForm 
            employee={selectedEmployee} 
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
          ¿Estás seguro que deseas eliminar a <strong>{selectedEmployee?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </>
  );
};

export default EmployeeList;