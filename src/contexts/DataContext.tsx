import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Client, Service, Appointment, Transaction, Employee, DashboardStats } from '../types';
import { format } from 'date-fns';

// Initial sample data
import { initialClients } from '../data/clients';
import { initialServices } from '../data/services';
import { initialAppointments } from '../data/appointments';
import { initialEmployees } from '../data/employees';

interface DataContextType {
  clients: Client[];
  services: Service[];
  appointments: Appointment[];
  transactions: Transaction[];
  employees: Employee[];
  
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, service: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  getDashboardStats: () => DashboardStats;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const savedClients = localStorage.getItem('clients');
    return savedClients ? JSON.parse(savedClients) : initialClients;
  });
  
  const [services, setServices] = useState<Service[]>(() => {
    const savedServices = localStorage.getItem('services');
    return savedServices ? JSON.parse(savedServices) : initialServices;
  });
  
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const savedAppointments = localStorage.getItem('appointments');
    return savedAppointments ? JSON.parse(savedAppointments) : initialAppointments;
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const savedEmployees = localStorage.getItem('employees');
    return savedEmployees ? JSON.parse(savedEmployees) : initialEmployees;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);
  
  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);
  
  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);
  
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);
  
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  // Client CRUD operations
  const addClient = (client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: uuidv4(),
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      lastVisit: null
    };
    setClients([...clients, newClient]);
  };

  const updateClient = (id: string, clientData: Partial<Client>) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, ...clientData } : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id));
  };

  // Service CRUD operations
  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...service,
      id: uuidv4()
    };
    setServices([...services, newService]);
  };

  const updateService = (id: string, serviceData: Partial<Service>) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, ...serviceData } : service
    ));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  // Appointment CRUD operations
  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: uuidv4()
    };
    setAppointments([...appointments, newAppointment]);
    
    // Update client's last visit date
    updateClient(appointment.clientId, {
      lastVisit: appointment.date
    });
  };

  const updateAppointment = (id: string, appointmentData: Partial<Appointment>) => {
    setAppointments(appointments.map(appointment => 
      appointment.id === id ? { ...appointment, ...appointmentData } : appointment
    ));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(appointment => appointment.id !== id));
  };

  // Transaction operations
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4()
    };
    setTransactions([...transactions, newTransaction]);
  };

  // Employee CRUD operations
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: uuidv4()
    };
    setEmployees([...employees, newEmployee]);
  };

  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    setEmployees(employees.map(employee => 
      employee.id === id ? { ...employee, ...employeeData } : employee
    ));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  // Dashboard statistics
  const getDashboardStats = (): DashboardStats => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const currentMonth = format(new Date(), 'yyyy-MM');
    
    const appointmentsToday = appointments.filter(
      appointment => appointment.date === today && appointment.status === 'completed'
    );
    
    const appointmentsThisMonth = appointments.filter(
      appointment => appointment.date.startsWith(currentMonth) && appointment.status === 'completed'
    );
    
    // Calculate appointments this week
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    const appointmentsThisWeek = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return (
        appointmentDate >= startOfWeek && 
        appointmentDate <= endOfWeek && 
        appointment.status === 'completed'
      );
    });
    
    return {
      totalClients: clients.length,
      appointmentsToday: appointmentsToday.length,
      revenueToday: appointmentsToday.reduce((sum, appointment) => sum + appointment.totalAmount, 0),
      appointmentsThisWeek: appointmentsThisWeek.length,
      revenueThisWeek: appointmentsThisWeek.reduce((sum, appointment) => sum + appointment.totalAmount, 0),
      appointmentsThisMonth: appointmentsThisMonth.length,
      revenueThisMonth: appointmentsThisMonth.reduce((sum, appointment) => sum + appointment.totalAmount, 0)
    };
  };

  return (
    <DataContext.Provider
      value={{
        clients,
        services,
        appointments,
        transactions,
        employees,
        addClient,
        updateClient,
        deleteClient,
        addService,
        updateService,
        deleteService,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addTransaction,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getDashboardStats
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};