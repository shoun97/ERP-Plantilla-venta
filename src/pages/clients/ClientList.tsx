import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card, { CardBody, CardHeader } from '../../components/UI/Card';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import Empty from '../../components/UI/Empty';
import Modal from '../../components/UI/Modal';
import { Plus, Search, Users, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import ClientForm from './ClientForm';
import { Client } from '../../types';

const ClientList: React.FC = () => {
  const { clients, deleteClient } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Filter clients based on search query
  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.phone.includes(searchQuery)
  );

  // Handle client edit
  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditModalOpen(true);
  };

  // Handle client delete
  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedClient) {
      deleteClient(selectedClient.id);
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Gestión de Clientes
        </h1>
        <Button 
          variant="primary" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Nuevo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader 
          title="Lista de Clientes" 
          icon={<Users className="w-5 h-5" />} 
          action={
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar cliente..."
                className="pl-9 py-1.5"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          }
        />
        <CardBody className="p-0">
          {filteredClients.length > 0 ? (
            <Table>
              <TableHead>
                <TableHeader>Nombre</TableHeader>
                <TableHeader>Contacto</TableHeader>
                <TableHeader>Última Visita</TableHeader>
                <TableHeader>Notas</TableHeader>
                <TableHeader className="text-right">Acciones</TableHeader>
              </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium text-gray-900">
                      {client.name}
                      <div className="text-xs text-gray-500 mt-1">
                        Cliente desde {new Date(client.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center mb-1">
                        <Phone className="w-3 h-3 text-gray-400 mr-1.5" />
                        {client.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 text-gray-400 mr-1.5" />
                        {client.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.lastVisit ? (
                        <Badge variant="primary">
                          {new Date(client.lastVisit).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Badge>
                      ) : (
                        <Badge variant="warning">Nunca</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="truncate max-w-xs">{client.notes || 'Sin notas'}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          onClick={() => handleEditClient(client)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDeleteClick(client)}
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
              title={searchQuery ? "No se encontraron resultados" : "No hay clientes"}
              description={searchQuery 
                ? "Intenta con otra búsqueda" 
                : "Agrega tu primer cliente para comenzar"
              }
              icon={<Users className="w-12 h-12" />}
              action={{
                label: "Agregar Cliente",
                onClick: () => setIsAddModalOpen(true)
              }}
            />
          )}
        </CardBody>
      </Card>

      {/* Add Client Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agregar Nuevo Cliente"
        size="lg"
      >
        <ClientForm onClose={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cliente"
        size="lg"
      >
        {selectedClient && (
          <ClientForm 
            client={selectedClient} 
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
          ¿Estás seguro que deseas eliminar a <strong>{selectedClient?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </>
  );
};

export default ClientList;