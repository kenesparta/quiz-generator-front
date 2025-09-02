import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./Navbar.module.css";

const Navbar: React.FC = () => {
  return (
    <div className={styles.navbarLayout}>
      {/* Left Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>Quiz Dashboard</h1>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink to="/dashboard" className={styles.navLink} end>
                Inicio
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/dashboard/postulante" className={styles.navLink}>
                Postulante
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/dashboard/evaluacion" className={styles.navLink}>
                Evaluación
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/dashboard/examen" className={styles.navLink}>
                Examen
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink to="/login" className={styles.navLink}>
                Salir
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
