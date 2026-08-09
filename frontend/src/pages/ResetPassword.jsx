import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "../components/Button";

import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import axios from "../api/axios.js";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      Swal.fire({
        icon: "error",
        title: "Enlace inválido",
        text: "El enlace de recuperación no es válido. Solicita uno nuevo.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        text: "Verifica que ambos campos sean iguales.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    setLoading(true);

    try {
      await axios.post("/auth/reset-password", {
        token,
        newPassword: formData.newPassword,
      });

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Ya puedes iniciar sesión con tu nueva contraseña.",
        confirmButtonColor: "#1e3a8a",
      });

      navigate("/login");
    } catch (err) {
      let errorTitle = "Error";
      let errorMessage = "Ocurrió un error inesperado. Intenta más tarde.";

      if (!err.response) {
        errorTitle = "Sin conexión";
        errorMessage =
          "No pudimos conectar con el servidor. Intentalo mas tarde";
      } else if (err.response.status === 400) {
        errorMessage =
          err.response.data?.message || "Token inválido o expirado.";
      } else {
        errorMessage = err.response.data?.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: errorTitle,
        text: errorMessage,
        confirmButtonColor: "#1e3a8a",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 to-blue-700 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-white opacity-30 rounded-full blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-[20%] right-[10%] w-48 h-48 bg-white opacity-20 rounded-full blur-xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-blue-100 p-10 relative z-10">
        <Link
          to="/login"
          className="absolute top-6 left-6 text-slate-400 hover:text-primary transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-8 mt-4">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full text-secondary">
              <img
                src={logo}
                alt="Logo VacunApp"
                className="h-10 w-auto drop-shadow-md"
              />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">
            Establece tu nueva contraseña
          </h2>
          <p className="text-sm text-slate-500">
            Debe tener al menos 8 caracteres
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Nueva contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Confirmar contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" isLoading={loading}>
            Restablecer contraseña
          </Button>
        </form>
      </div>
    </div>
  );
};
