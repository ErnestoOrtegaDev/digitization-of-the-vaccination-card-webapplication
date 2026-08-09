import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Megaphone, ArrowRight } from "lucide-react";
import axios from "../api/axios";

export const PublicCalendar = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/campaigns");
      setCampaigns(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar campañas públicas:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const availableStates = Array.from(
    new Set(campaigns.map((campaign) => campaign.state).filter(Boolean)),
  );

  const filteredCampaigns = campaigns.filter((campaign) => {
    const term = stateFilter.toLowerCase();
    return (
      !term ||
      campaign.state?.toLowerCase().includes(term) ||
      campaign.locality?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <CalendarDays size={28} className="text-blue-900" />
              Calendario de Campañas
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Consulta las campañas activas en el catálogo y encuentra los próximos puntos de vacunación cerca de ti.
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

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-blue-900">
            <Megaphone size={24} />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Campañas registradas</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{campaigns.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-blue-900">
            <MapPin size={24} />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Estados cubiertos</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{availableStates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-blue-900">
            <CalendarDays size={24} />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Selecciona estado</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{stateFilter || "Todos"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 bg-blue-50 text-blue-900 rounded-2xl px-4 py-3">
          <CalendarDays size={20} />
          <span className="font-semibold">Filtrar campañas</span>
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="w-full md:w-60 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none"
        >
          <option value="">Todos los estados</option>
          {availableStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-14 text-center text-slate-500 font-medium">
          Cargando calendario de campañas...
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-14 text-center text-slate-500 font-medium">
          No hay campañas disponibles para el filtro seleccionado.
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {filteredCampaigns.map((campaign) => (
            <article key={campaign.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wide text-slate-400">Campaña</span>
                  <h2 className="text-xl font-bold text-slate-800 mt-2">{campaign.healthCenter || campaign.name || "Campaña sin título"}</h2>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">
                  <CalendarDays size={20} />
                </div>
              </div>
              <div className="mt-6 space-y-4 text-slate-600 text-sm">
                <div>
                  <p className="font-semibold text-slate-800">Localidad</p>
                  <p>{campaign.locality || "No especificada"}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Estado</p>
                  <p>{campaign.state || "No especificado"}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Dirección</p>
                  <p>{campaign.address || "No disponible"}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Brotes</p>
                  <p>{campaign.diseaseOutbreak || "No reportado"}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};