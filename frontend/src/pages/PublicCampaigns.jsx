import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Megaphone, Search, ArrowRight, Globe } from "lucide-react";
import axios from "../api/axios";

export const PublicCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/campaigns");
      setCampaigns(response.data.data || []);
    } catch (error) {
      console.error("Error fetching public campaigns:", error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const term = searchTerm.toLowerCase();
    return (
      campaign.healthCenter?.toLowerCase().includes(term) ||
      campaign.diseaseOutbreak?.toLowerCase().includes(term) ||
      campaign.state?.toLowerCase().includes(term) ||
      campaign.locality?.toLowerCase().includes(term) ||
      campaign.address?.toLowerCase().includes(term)
    );
  }).filter((campaign) => {
    return stateFilter === "" || campaign.state === stateFilter;
  });

  const availableStates = Array.from(new Set(campaigns.map((campaign) => campaign.state).filter(Boolean)));

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Megaphone size={28} className="text-blue-900" />
              Campañas en Curso
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl">
              Consulta las campañas de vacunación activas y sus ubicaciones para participar en los próximos días.
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

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-blue-900">
            <CalendarDays size={24} />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Campañas activas</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{campaigns.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-blue-900">
            <Globe size={24} />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Estados cubiertos</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{availableStates.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
          <div className="flex items-center gap-3 text-blue-900">
            <Search size={24} />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Buscar campaña</p>
              <p className="text-xl font-bold text-slate-800 mt-1">Filtra por estado o término</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por centro, enfermedad, estado o localidad..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-blue-900"
          />
        </div>
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="w-full md:w-60 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-700 outline-none"
        >
          <option value="">Filtrar por estado</option>
          {availableStates.map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-14 text-center text-slate-500 font-medium">
          Cargando campañas...
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-14 text-center text-slate-500 font-medium">
          No se encontraron campañas con esos criterios.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-slate-500 text-xs uppercase tracking-wide">Campaña</p>
                  <h2 className="text-xl font-bold text-slate-800 mt-2">{campaign.healthCenter || "Campaña"}</h2>
                </div>
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-900">
                  <Megaphone size={20} />
                </div>
              </div>
              <div className="mt-6 space-y-3 text-slate-600 text-sm">
                <div>
                  <span className="font-semibold text-slate-800">Estado:</span> {campaign.state || "No disponible"}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Localidad:</span> {campaign.locality || "No disponible"}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Ubicación:</span> {campaign.address || "No disponible"}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Enfermedades:</span> {campaign.diseaseOutbreak || "No especificado"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};