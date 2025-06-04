import { Appointment } from '../types';

export const initialAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    date: '2023-04-20',
    startTime: '10:00',
    endTime: '11:00',
    serviceIds: ['2', '3'],
    status: 'completed',
    totalAmount: 65,
    notes: 'Cliente satisfecha con el servicio'
  },
  {
    id: '2',
    clientId: '2',
    date: '2023-04-15',
    startTime: '14:00',
    endTime: '15:30',
    serviceIds: ['1', '4'],
    status: 'completed',
    totalAmount: 65,
    notes: 'Solicitó diseños de flores pequeñas'
  },
  {
    id: '3',
    clientId: '3',
    date: '2023-04-10',
    startTime: '11:00',
    endTime: '13:00',
    serviceIds: ['5', '6'],
    status: 'completed',
    totalAmount: 100,
    notes: 'Trajo sus propias referencias de diseño'
  },
  {
    id: '4',
    clientId: '4',
    date: '2023-04-22',
    startTime: '16:00',
    endTime: '16:45',
    serviceIds: ['2', '7'],
    status: 'completed',
    totalAmount: 50,
    notes: 'Llegó 10 minutos tarde'
  },
  {
    id: '5',
    clientId: '5',
    date: '2023-04-18',
    startTime: '13:00',
    endTime: '14:30',
    serviceIds: ['3', '8'],
    status: 'completed',
    totalAmount: 55,
    notes: 'Muy satisfecha con el tratamiento de parafina'
  },
  {
    id: '6',
    clientId: '1',
    date: '2023-04-28',
    startTime: '15:00',
    endTime: '16:00',
    serviceIds: ['2'],
    status: 'scheduled',
    totalAmount: 35,
    notes: 'Cita de seguimiento'
  }
];