import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Layout from './components/Layout/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import ClientList from './pages/clients/ClientList';
import ServiceList from './pages/services/ServiceList';
import AppointmentList from './pages/appointments/AppointmentList';
import EmployeeList from './pages/employees/EmployeeList';
import FinancesPage from './pages/finances/FinancesPage';

function App() {
  return (
    <DataProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientList />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/finances" element={<FinancesPage />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;