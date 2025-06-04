import React, { useState } from 'react';
import { BarChart3, Users, CalendarDays, DollarSign, TrendingUp, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import Card, { CardBody, CardHeader } from '../components/UI/Card';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/UI/Table';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { clients, appointments, getDashboardStats } = useData();
  const stats = getDashboardStats();
  
  const [timeframe, setTimeframe] = useState<'today' | 'week' | 'month'>('today');
  
  // Get upcoming appointments (scheduled for today or in the future)
  const today = new Date().toISOString().split('T')[0];
  const upcomingAppointments = appointments
    .filter(appointment => appointment.status === 'scheduled' && appointment.date >= today)
    .sort((a, b) => {
      // Sort by date first
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      // If same date, sort by start time
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 5);
  
  // Get clients who haven't visited in a while (more than 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const inactiveClients = clients
    .filter(client => {
      if (!client.lastVisit) return true;
      const lastVisitDate = new Date(client.lastVisit);
      return lastVisitDate < thirtyDaysAgo;
    })
    .slice(0, 5);
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CardBody className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Clientes</p>
              <h3 className="text-2xl font-semibold">{stats.totalClients}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CardBody className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <CalendarDays className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <div className="flex space-x-2 mb-1">
                <button 
                  className={`text-xs px-2 py-0.5 rounded-full ${timeframe === 'today' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
                  onClick={() => setTimeframe('today')}
                >
                  Hoy
                </button>
                <button 
                  className={`text-xs px-2 py-0.5 rounded-full ${timeframe === 'week' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
                  onClick={() => setTimeframe('week')}
                >
                  Semana
                </button>
                <button 
                  className={`text-xs px-2 py-0.5 rounded-full ${timeframe === 'month' ? 'bg-purple-100 text-purple-700' : 'text-gray-500'}`}
                  onClick={() => setTimeframe('month')}
                >
                  Mes
                </button>
              </div>
              <h3 className="text-2xl font-semibold">
                {timeframe === 'today' && stats.appointmentsToday}
                {timeframe === 'week' && stats.appointmentsThisWeek}
                {timeframe === 'month' && stats.appointmentsThisMonth}
              </h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CardBody className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ingresos {timeframe === 'today' ? 'Hoy' : timeframe === 'week' ? 'Esta Semana' : 'Este Mes'}</p>
              <h3 className="text-2xl font-semibold">
                ${timeframe === 'today' && stats.revenueToday}
                {timeframe === 'week' && stats.revenueThisWeek}
                {timeframe === 'month' && stats.revenueThisMonth}
              </h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CardBody className="flex items-center">
            <div className="rounded-full bg-pink-100 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Servicio Promedio</p>
              <h3 className="text-2xl font-semibold">
                ${stats.appointmentsThisMonth > 0 
                  ? Math.round(stats.revenueThisMonth / stats.appointmentsThisMonth) 
                  : 0}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader 
            title="Próximas Citas" 
            icon={<Clock className="h-5 w-5" />}
            action={
              <Link 
                to="/appointments" 
                className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
              >
                Ver Todas
              </Link>
            }
          />
          <CardBody className="p-0">
            {upcomingAppointments.length > 0 ? (
              <Table>
                <TableHead>
                  <TableHeader>Cliente</TableHeader>
                  <TableHeader>Fecha</TableHeader>
                  <TableHeader>Hora</TableHeader>
                  <TableHeader>Total</TableHeader>
                </TableHead>
                <TableBody>
                  {upcomingAppointments.map((appointment) => {
                    const client = clients.find(c => c.id === appointment.clientId);
                    return (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium text-gray-900">
                          {client?.name || 'Cliente desconocido'}
                        </TableCell>
                        <TableCell>
                          {new Date(appointment.date).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>{appointment.startTime}</TableCell>
                        <TableCell className="font-medium text-gray-900">
                          ${appointment.totalAmount}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No hay citas programadas
              </div>
            )}
          </CardBody>
        </Card>
        
        {/* Inactive Clients */}
        <Card>
          <CardHeader 
            title="Clientes Inactivos" 
            icon={<Users className="h-5 w-5" />}
            action={
              <Link 
                to="/clients" 
                className="text-sm text-pink-600 hover:text-pink-700 hover:underline"
              >
                Ver Todos
              </Link>
            }
          />
          <CardBody className="p-0">
            {inactiveClients.length > 0 ? (
              <Table>
                <TableHead>
                  <TableHeader>Cliente</TableHeader>
                  <TableHeader>Última Visita</TableHeader>
                  <TableHeader>Contacto</TableHeader>
                </TableHead>
                <TableBody>
                  {inactiveClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium text-gray-900">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        {client.lastVisit 
                          ? new Date(client.lastVisit).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            }) 
                          : 'Nunca'}
                      </TableCell>
                      <TableCell>{client.phone}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="py-8 text-center text-gray-500">
                No hay clientes inactivos
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;