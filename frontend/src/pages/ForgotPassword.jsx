import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "../components/Button";

import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import axios from "../api/axios.js";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/auth/forgot-password", { email });

      setSent(true);

      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: "Si el correo existe en nuestro sistema, recibirás instrucciones para restablecer tu contraseña.",
        confirmButtonColor: "#1e3a8a",
      });
    } catch (err) {
      let errorTitle = "Error";
      let errorMessage = "Ocurrió un error inesperado. Intenta más tarde.";

      if (!err.response) {
        errorTitle = "Sin conexión";
        errorMessage =
          "No pudimos conectar con el servidor. Intentalo mas tarde";
      } else if (err.response.status === 429) {
        errorMessage =
          err.response.data?.message ||
          "Demasiadas solicitudes. Intenta más tarde.";
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
            Recupera tu contraseña
          </h2>
          <p className="text-sm text-slate-500">
            Ingresa tu correo y te enviaremos instrucciones para restablecerla
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-sm text-slate-600">
              Revisa tu bandeja de entrada (y la carpeta de spam). El enlace
              expira en 30 minutos.
            </p>
            <Link
              to="/login"
              className="inline-block mt-6 text-secondary font-bold hover:underline text-sm"
            >
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                  placeholder="juan@ejemplo.com"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" isLoading={loading}>
              Enviar instrucciones
            </Button>
          </form>
        )}

        <div className="text-center mt-6 text-sm text-slate-600">
          ¿Ya la recordaste?{" "}
          <Link
            to="/login"
            className="text-secondary font-bold hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
