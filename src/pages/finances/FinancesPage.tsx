import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import Card, { CardBody, CardHeader } from '../../components/UI/Card';
import Table, { TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/UI/Table';
import Button from '../../components/UI/Button';
import Badge from '../../components/UI/Badge';
import { DollarSign, TrendingUp, BarChart3, Calendar, Download } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const FinancesPage: React.FC = () => {
  const { appointments, clients, services } = useData();
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get completed appointments
  const completedAppointments = appointments.filter(
    appointment => appointment.status === 'completed'
  );
  
  // Format date for display
  const formatDate = (date: Date): string => {
    if (period === 'daily') {
      return format(date, 'dd MMMM yyyy', { locale: es });
    } else if (period === 'weekly') {
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${format(startOfWeek, 'dd', { locale: es })} - ${format(endOfWeek, 'dd MMMM yyyy', { locale: es })}`;
    } else {
      return format(date, 'MMMM yyyy', { locale: es });
    }
  };
  
  // Get appointments for the current period
  const getCurrentPeriodAppointments = () => {
    if (period === 'daily') {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      return completedAppointments.filter(
        appointment => appointment.date === dateString
      );
    } else if (period === 'weekly') {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      
      return completedAppointments.filter(appointment => {
        const appointmentDate = parseISO(appointment.date);
        return isWithinInterval(appointmentDate, { start: startOfWeek, end: endOfWeek });
      });
    } else {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const monthString = format(currentDate, 'yyyy-MM');
      
      return completedAppointments.filter(
        appointment => appointment.date.startsWith(monthString)
      );
    }
  };
  
  const currentPeriodAppointments = getCurrentPeriodAppointments();
  
  // Calculate total revenue for the current period
  const totalRevenue = currentPeriodAppointments.reduce(
    (total, appointment) => total + appointment.totalAmount, 
    0
  );
  
  // Get service popularity
  const getServicePopularity = () => {
    const serviceCounts: Record<string, number> = {};
    
    currentPeriodAppointments.forEach(appointment => {
      appointment.serviceIds.forEach(serviceId => {
        serviceCounts[serviceId] = (serviceCounts[serviceId] || 0) + 1;
      });
    });
    
    return Object.entries(serviceCounts)
      .map(([serviceId, count]) => {
        const service = services.find(s => s.id === serviceId);
        return {
          serviceId,
          name: service ? service.name : 'Servicio desconocido',
          count,
          revenue: service ? service.price * count : 0
        };
      })
      .sort((a, b) => b.count - a.count);
  };
  
  const servicePopularity = getServicePopularity();
  
  // Navigate to previous period
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (period === 'daily') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (period === 'weekly') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };
  
  // Navigate to next period
  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (period === 'daily') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (period === 'weekly') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // Generate daily revenue data for the current month
  const generateDailyRevenueData = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    return days.map(day => {
      const dateString = format(day, 'yyyy-MM-dd');
      const dayAppointments = completedAppointments.filter(
        appointment => appointment.date === dateString
      );
      const revenue = dayAppointments.reduce(
        (total, appointment) => total + appointment.totalAmount, 
        0
      );
      
      return {
        date: format(day, 'dd', { locale: es }),
        revenue
      };
    });
  };
  
  const dailyRevenueData = generateDailyRevenueData();
  
  // Function to export financial data to CSV
  const exportToCSV = () => {
    const headers = ['Fecha', 'Cliente', 'Servicios', 'Total'];
    
    const rows = currentPeriodAppointments.map(appointment => {
      const client = clients.find(c => c.id === appointment.clientId);
      const serviceNames = appointment.serviceIds
        .map(id => {
          const service = services.find(s => s.id === id);
          return service ? service.name : 'Servicio desconocido';
        })
        .join(', ');
      
      return [
        appointment.date,
        client ? client.name : 'Cliente desconocido',
        serviceNames,
        appointment.totalAmount.toString()
      ];
    });
    
    // Add summary row
    rows.push(['', '', 'TOTAL', totalRevenue.toString()]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte-financiero-${format(currentDate, 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          Reporte Financiero
        </h1>
        <Button 
          variant="success" 
          icon={<Download className="w-4 h-4" />}
          onClick={exportToCSV}
        >
          Exportar Reporte
        </Button>
      </div>

      {/* Period selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap items-center justify-between">
        <div className="flex space-x-2 mb-4 md:mb-0">
          <Button 
            variant={period === 'daily' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('daily')}
          >
            Diario
          </Button>
          <Button 
            variant={period === 'weekly' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('weekly')}
          >
            Semanal
          </Button>
          <Button 
            variant={period === 'monthly' ? 'primary' : 'outline'} 
            size="sm"
            onClick={() => setPeriod('monthly')}
          >
            Mensual
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToPreviousPeriod}
          >
            &lt; Anterior
          </Button>
          
          <span className="font-medium">{formatDate(currentDate)}</span>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={goToNextPeriod}
          >
            Siguiente &gt;
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CardBody className="flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Ingresos Totales</p>
              <h3 className="text-2xl font-semibold">${totalRevenue}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CardBody className="flex items-center">
            <div className="rounded-full bg-purple-100 p-3 mr-4">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Citas Completadas</p>
              <h3 className="text-2xl font-semibold">{currentPeriodAppointments.length}</h3>
            </div>
          </CardBody>
        </Card>
        
        <Card className="transform transition-all duration-300 hover:scale-105 hover:shadow-md">
          <CardBody className="flex items-center">
            <div className="rounded-full bg-blue-100 p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Valor Promedio por Cita</p>
              <h3 className="text-2xl font-semibold">
                ${currentPeriodAppointments.length > 0 
                  ? Math.round(totalRevenue / currentPeriodAppointments.length) 
                  : 0}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader 
            title="Ingresos por Día" 
            icon={<BarChart3 className="w-5 h-5" />}
          />
          <CardBody>
            <div className="h-64">
              <div className="flex h-full items-end">
                {dailyRevenueData.map((day, index) => (
                  <div 
                    key={index} 
                    className="flex-1 flex flex-col items-center"
                  >
                    <div 
                      className="w-full bg-pink-200 rounded-t-sm hover:bg-pink-300 transition-colors"
                      style={{ 
                        height: `${Math.max(
                          (day.revenue / Math.max(...dailyRevenueData.map(d => d.revenue || 1))) * 100, 
                          5
                        )}%` 
                      }}
                    >
                      <div className="invisible group-hover:visible text-xs text-center pt-1">
                        ${day.revenue}
                      </div>
                    </div>
                    <div className="text-xs mt-1">{day.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Popular Services */}
        <Card>
          <CardHeader 
            title="Servicios Populares" 
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <CardBody className="p-0">
            <Table>
              <TableHead>
                <TableHeader>Servicio</TableHeader>
                <TableHeader>Solicitudes</TableHeader>
                <TableHeader>Ingresos</TableHeader>
              </TableHead>
              <TableBody>
                {servicePopularity.length > 0 ? (
                  servicePopularity.map((service) => (
                    <TableRow key={service.serviceId}>
                      <TableCell className="font-medium text-gray-900">
                        {service.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="primary">{service.count}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${service.revenue}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No hay datos disponibles para este período
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Transaction History */}
      <Card className="mt-6">
        <CardHeader 
          title="Historial de Transacciones" 
          icon={<DollarSign className="w-5 h-5" />}
        />
        <CardBody className="p-0">
          <Table>
            <TableHead>
              <TableHeader>Fecha</TableHeader>
              <TableHeader>Cliente</TableHeader>
              <TableHeader>Servicios</TableHeader>
              <TableHeader>Total</TableHeader>
            </TableHead>
            <TableBody>
              {currentPeriodAppointments.length > 0 ? (
                currentPeriodAppointments.map((appointment) => {
                  const client = clients.find(c => c.id === appointment.clientId);
                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                        <div className="text-xs text-gray-500">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {client ? client.name : 'Cliente desconocido'}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {appointment.serviceIds.map((serviceId) => {
                            const service = services.find(s => s.id === serviceId);
                            return service ? (
                              <Badge key={serviceId} variant="default" size="sm">
                                {service.name}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        ${appointment.totalAmount}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No hay transacciones para este período
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};

export default FinancesPage;