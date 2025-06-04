import { Employee } from '../types';

export const initialEmployees: Employee[] = [
  {
    id: '1',
    name: 'Gabriela Torres',
    position: 'Manicurista Senior',
    appointmentIds: ['1', '4', '6']
  },
  {
    id: '2',
    name: 'Valentina Ruiz',
    position: 'Especialista en Uñas Acrílicas',
    appointmentIds: ['3']
  },
  {
    id: '3',
    name: 'Isabella Morales',
    position: 'Manicurista y Pedicurista',
    appointmentIds: ['2', '5']
  }
];