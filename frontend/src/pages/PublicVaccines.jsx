import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Syringe, Search, ShieldCheck, ArrowRight } from "lucide-react";
import axios from "../api/axios";

export const PublicVaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchVaccines = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/vaccines");
      setVaccines(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar vacunas públicas:", error);
      setVaccines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVaccines();
  }, []);

  const filteredVaccines = vaccines.filter((vaccine) => {
    const term = searchTerm.toLowerCase();
    return (
      vaccine.name?.toLowerCase().includes(term) ||
      vaccine.disease_prevented?.toLowerCase().includes(term) ||
      vaccine.administration_method?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Syringe size={28} className="text-blue-900" />
              Vacunas Disponibles
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Consulta el catálogo público de vacunas aprobadas y descubre qué biológicos están disponibles en la red de VacunApp MX.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-100 transition"
          >
            Volver al inicio <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 bg-blue-50 text-blue-900 rounded-2xl px-4 py-3">
          <ShieldCheck size={20} />
          <span className="font-semibold">Consulta libre de sesión</span>
        </div>
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por vacuna, enfermedad o vía..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-900 outline-none"
          />
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
          Total: {filteredVaccines.length} {filteredVaccines.length === 1 ? "vacuna" : "vacunas"}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-14 text-center text-slate-500 font-medium">
          Cargando vacunas disponibles...
        </div>
      ) : filteredVaccines.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-14 text-center text-slate-500 font-medium">
          No se encontraron vacunas para los criterios ingresados.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredVaccines.map((vaccine) => (
            <div key={vaccine.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{vaccine.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">{vaccine.disease_prevented}</p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">
                  <Syringe size={20} />
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-slate-400 text-xs uppercase tracking-wide">Vía de administración</span>
                  <p className="font-semibold text-slate-800 mt-1">{vaccine.administration_method}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <span className="block text-slate-400 text-xs uppercase tracking-wide">Estado</span>
                  <p className="font-semibold text-slate-800 mt-1">Disponible</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};