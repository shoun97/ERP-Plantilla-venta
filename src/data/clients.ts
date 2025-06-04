import { Client } from '../types';

export const initialClients: Client[] = [
  {
    id: '1',
    name: 'Ana Martínez',
    phone: '555-123-4567',
    email: 'ana.martinez@example.com',
    preferredServices: ['2', '3'],
    notes: 'Prefiere tonos pastel',
    createdAt: '2023-01-15',
    lastVisit: '2023-04-20'
  },
  {
    id: '2',
    name: 'Sofía Rodríguez',
    phone: '555-234-5678',
    email: 'sofia.rodriguez@example.com',
    preferredServices: ['1', '4'],
    notes: 'Alérgica a ciertos químicos, verificar antes',
    createdAt: '2023-02-10',
    lastVisit: '2023-04-15'
  },
  {
    id: '3',
    name: 'Luisa Fernández',
    phone: '555-345-6789',
    email: 'luisa.fernandez@example.com',
    preferredServices: ['5', '6'],
    notes: 'Cliente frecuente, le gusta el diseño de flores',
    createdAt: '2023-01-05',
    lastVisit: '2023-04-10'
  },
  {
    id: '4',
    name: 'Carmen Gómez',
    phone: '555-456-7890',
    email: 'carmen.gomez@example.com',
    preferredServices: ['2', '7'],
    notes: 'Prefiere manicura rápida, suele tener prisa',
    createdAt: '2023-03-20',
    lastVisit: '2023-04-22'
  },
  {
    id: '5',
    name: 'María López',
    phone: '555-567-8901',
    email: 'maria.lopez@example.com',
    preferredServices: ['3', '8'],
    notes: 'Le gusta conversación mínima durante el servicio',
    createdAt: '2023-02-25',
    lastVisit: '2023-04-18'
  }
];