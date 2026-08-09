import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Search, Building2, ArrowRight } from "lucide-react";
import axios from "../api/axios";

export const PublicHealthCenters = () => {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCenters = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/health-centers");
      setCenters(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar centros públicos:", error);
      setCenters([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  const filteredCenters = centers.filter((center) => {
    const term = searchTerm.toLowerCase();
    return (
      center.name?.toLowerCase().includes(term) ||
      center.clues?.toLowerCase().includes(term) ||
      center.address?.toLowerCase().includes(term) ||
      center.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Building2 size={28} className="text-blue-900" />
              Centros de Salud Activos
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Encuentra los centros de salud disponibles en la red de VacunApp MX para recibir atención y esquemas de vacunación.
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
          <Search size={20} />
          <span className="font-semibold">Buscar centro</span>
        </div>
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, CLUES, dirección o teléfono..."
            className="w-full pl-4 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 focus:border-blue-900 outline-none"
          />
        </div>
        <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
          Total: {filteredCenters.length} {filteredCenters.length === 1 ? "centro" : "centros"}
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-14 text-center text-slate-500 font-medium">
          Cargando centros de salud...
        </div>
      ) : filteredCenters.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-14 text-center text-slate-500 font-medium">
          No se encontraron centros de salud con esos criterios.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCenters.map((center) => (
            <div key={center.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{center.name}</h2>
                  <p className="text-sm text-slate-500 mt-1">CLUES: {center.clues}</p>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">
                  <MapPin size={20} />
                </div>
              </div>
              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="block text-slate-400 text-xs uppercase tracking-wide">Dirección:</span>
                  {center.address}
                </p>
                <p>
                  <span className="block text-slate-400 text-xs uppercase tracking-wide">Teléfono:</span>
                  {center.phone || "No disponible"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};