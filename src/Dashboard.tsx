import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  return (
    <div className="">
      <nav className="menu">
        <ul>
          <li>
            <Link to="/dashboard">Inicio</Link>
          </li>
          <li>
            <Link to="/dashboard/postulante">Postulante</Link>
          </li>
          <li>
            <Link to="/dashboard/evaluacion">Evaluación</Link>
          </li>
          <li>
            <Link to="/dashboard/examen">Examen</Link>
          </li>
          <li>
            <Link to="/login">Salir</Link>
          </li>
        </ul>
      </nav>

      <section className="content">
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;