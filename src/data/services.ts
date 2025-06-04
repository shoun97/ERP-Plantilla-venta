import { Service } from '../types';

export const initialServices: Service[] = [
  {
    id: '1',
    name: 'Manicura Básica',
    description: 'Limado, cutícula y esmalte tradicional',
    duration: 30,
    price: 20,
    category: 'Básicos'
  },
  {
    id: '2',
    name: 'Manicura de Gel',
    description: 'Manicura completa con aplicación de gel de larga duración',
    duration: 45,
    price: 35,
    category: 'Premium'
  },
  {
    id: '3',
    name: 'Manicura Francesa',
    description: 'Manicura clásica con punta blanca y base rosa',
    duration: 45,
    price: 30,
    category: 'Clásicos'
  },
  {
    id: '4',
    name: 'Manicura con Diseño',
    description: 'Incluye arte en uñas con diseños personalizados',
    duration: 60,
    price: 45,
    category: 'Artísticos'
  },
  {
    id: '5',
    name: 'Pedicura Completa',
    description: 'Tratamiento completo para pies con exfoliación',
    duration: 60,
    price: 40,
    category: 'Pedicura'
  },
  {
    id: '6',
    name: 'Uñas Acrílicas',
    description: 'Aplicación de uñas acrílicas con el diseño de tu elección',
    duration: 90,
    price: 60,
    category: 'Premium'
  },
  {
    id: '7',
    name: 'Reparación de Uñas',
    description: 'Arreglo de uñas dañadas o rotas',
    duration: 20,
    price: 15,
    category: 'Básicos'
  },
  {
    id: '8',
    name: 'Tratamiento de Parafina',
    description: 'Hidratación profunda con baño de parafina',
    duration: 30,
    price: 25,
    category: 'Tratamientos'
  }
];