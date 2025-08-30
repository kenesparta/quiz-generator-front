import { createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import Dashboard from './Dashboard.tsx'

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        index: true,
        element: <div>Dashboard Home - Inicio</div>,
      },
      {
        path: "postulante",
        element: <div>Postulante Page</div>,
      },
      {
        path: "evaluacion",
        element: <div>Evaluación Page</div>,
      },
      {
        path: "examen",
        element: <div>Examen Page</div>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/login",
    element: <div>Login Page</div>,
  },
])