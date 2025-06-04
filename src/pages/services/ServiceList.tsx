import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card, { CardBody, CardHeader } from '../../components/UI/Card';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Badge from '../../components/UI/Badge';
import Empty from '../../components/UI/Empty';
import Modal from '../../components/UI/Modal';
import { Plus, Search, Palette, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';
import ServiceForm from './ServiceForm';
import { Service } from '../../types';

const ServiceList: React.FC = () => {
  const { services, deleteService } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Get unique categories
  const categories = Array.from(new Set(services.map(service => service.category)));

  // Filter services based on search query and category
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !categoryFilter || service.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Handle service edit
  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setIsEditModalOpen(true);
  };

  // Handle service delete
  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedService) {
      deleteService(selectedService.id);
      setIsDeleteModalOpen(false);
      setSelectedService(null);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Catálogo de Servicios
        </h1>
        <Button 
          variant="primary" 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Nuevo Servicio
        </Button>
      </div>

      <Card>
        <CardHeader 
          title="Lista de Servicios" 
          icon={<Palette className="w-5 h-5" />} 
          action={
            <div className="flex items-center space-x-4">
              <select
                className="rounded-lg border border-gray-300 py-1.5 px-3 focus:border-pink-500 focus:ring-pink-500 text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar servicio..."
                  className="pl-9 py-1.5"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          }
        />
        <CardBody className="p-0">
          {filteredServices.length > 0 ? (
            <Table>
              <TableHead>
                <TableHeader>Servicio</TableHeader>
                <TableHeader>Categoría</TableHeader>
                <TableHeader>Duración</TableHeader>
                <TableHeader>Precio</TableHeader>
                <TableHeader className="text-right">Acciones</TableHeader>
              </TableHead>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        service.category === 'Premium' ? 'primary' :
                        service.category === 'Básicos' ? 'default' :
                        service.category === 'Clásicos' ? 'success' :
                        service.category === 'Artísticos' ? 'warning' :
                        'default'
                      }>
                        {service.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-gray-400 mr-1.5" />
                        {service.duration} min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        <DollarSign className="w-4 h-4 text-gray-400 mr-0.5" />
                        {service.price}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          icon={<Edit className="w-4 h-4" />}
                          onClick={() => handleEditService(service)}
                        >
                          Editar
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => handleDeleteClick(service)}
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
              title={searchQuery || categoryFilter ? "No se encontraron resultados" : "No hay servicios"}
              description={searchQuery || categoryFilter
                ? "Intenta con otra búsqueda o categoría" 
                : "Agrega tu primer servicio para comenzar"
              }
              icon={<Palette className="w-12 h-12" />}
              action={{
                label: "Agregar Servicio",
                onClick: () => setIsAddModalOpen(true)
              }}
            />
          )}
        </CardBody>
      </Card>

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agregar Nuevo Servicio"
        size="lg"
      >
        <ServiceForm 
          onClose={() => setIsAddModalOpen(false)} 
          categories={categories}
        />
      </Modal>

      {/* Edit Service Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Servicio"
        size="lg"
      >
        {selectedService && (
          <ServiceForm 
            service={selectedService} 
            onClose={() => setIsEditModalOpen(false)} 
            categories={categories}
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
          ¿Estás seguro que deseas eliminar el servicio <strong>{selectedService?.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
      </Modal>
    </>
  );
};

export default ServiceList;