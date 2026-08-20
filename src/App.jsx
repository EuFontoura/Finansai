import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import Layout from "./components/layout/Layout"
import ProtectedRoute from "./components/auth/ProtectedRoute"

import Dashboard from "./pages/Dashboard"
import Lancamentos from "./pages/Lancamentos"
import Investimentos from "./pages/Investimentos"
import Login from "./pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/lancamentos"
            element={<Lancamentos />}
          />
          <Route
            path="/investimentos"
            element={<Investimentos />}
          />
        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App