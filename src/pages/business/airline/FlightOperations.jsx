// src/pages/business/airline/FlightOperations.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plane, Navigation, Clock, TrendingUp,
  Check, AlertTriangle, Play, Users
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import { canStartFlight, getFlightDuration, FLIGHT_CONFIG } from '../../../data/airlineData';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatTime } from '../../../utils/formatTime';
import AdSpace from '../../../components/common/AdSpace';

function FlightOperations() {
  const { bizId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;

  const { ownedBusinesses, startAirlineFlight } = useGame();
  const biz = ownedBusinesses.find(b => b.id === bizId);

  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!biz || !biz.airline) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const airline = biz.airline;
  const allAircraft = (airline.aircraft || []).filter(a => a.active);
  const activeFlights = (airline.activeFlights || []).filter(f => f.endTime && Date.now() < f.endTime);
  const aircraftOnFlight = new Set(activeFlights.map(f => f.aircraftId));

  const availableAircraft = allAircraft.filter(a => !aircraftOnFlight.has(a.id));
  const totalIncome = activeFlights.reduce((sum, f) => sum + (f.incomePerHour || 0), 0);

  // Staff check
  const staff = airline.staff || {};
  const totalActiveAircraft = allAircraft.length;
  const neededPilots = totalActiveAircraft * 2;
  const neededCopilots = totalActiveAircraft;
  const neededCrew = totalActiveAircraft * 4;
  const hasEnoughStaff = (staff.pilot || 0) >= neededPilots &&
    (staff.copilot || 0) >= neededCopilots &&
    (staff.cabin_crew || 0) >= neededCrew;

  const handleStartFlight = (aircraftId) => {
    startAirlineFlight(bizId, aircraftId);
  };

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      {/* Header */}
      <div className={`flex-shrink-0 px-4 pt-3 pb-3 ${t.bg.card} border-b ${t.border.default}`}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/business/airline/${bizId}`)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1">
            <p className={`text-base font-bold ${t.text.primary}`}>Flight Operations</p>
            <p className={`text-[10px] ${t.text.tertiary}`}>
              {activeFlights.length} active • {availableAircraft.length} available
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">

        {/* Income Summary */}
        {activeFlights.length > 0 && (
          <div className={`rounded-xl p-3 ${isDark ? 'bg-green-500/10' : 'bg-green-50'}
            border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-xs font-bold text-green-500">Active Flight Income</span>
              </div>
              <span className="text-lg font-black text-green-500">{formatCurrency(totalIncome)}/hr</span>
            </div>
          </div>
        )}

        {/* Staff Warning */}
        {!hasEnoughStaff && allAircraft.length > 0 && (
          <div className={`rounded-xl p-3 ${isDark ? 'bg-red-500/10' : 'bg-red-50'}
            border ${isDark ? 'border-red-500/20' : 'border-red-200'}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-xs font-bold text-red-500">Insufficient Staff</span>
            </div>
            <div className="space-y-0.5">
              {(staff.pilot || 0) < neededPilots && (
                <p className="text-[10px] text-red-400">
                  Pilots: {staff.pilot || 0}/{neededPilots} (need {neededPilots - (staff.pilot || 0)} more)
                </p>
              )}
              {(staff.copilot || 0) < neededCopilots && (
                <p className="text-[10px] text-red-400">
                  Co-Pilots: {staff.copilot || 0}/{neededCopilots} (need {neededCopilots - (staff.copilot || 0)} more)
                </p>
              )}
              {(staff.cabin_crew || 0) < neededCrew && (
                <p className="text-[10px] text-red-400">
                  Cabin Crew: {staff.cabin_crew || 0}/{neededCrew} (need {neededCrew - (staff.cabin_crew || 0)} more)
                </p>
              )}
            </div>
          </div>
        )}

        {/* ═══ ACTIVE FLIGHTS ═══ */}
        {activeFlights.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
              ✈️ In-Flight ({activeFlights.length})
            </p>
            <div className="space-y-2">
              {activeFlights.map(flight => {
                const remaining = Math.max(0, Math.floor((flight.endTime - Date.now()) / 1000));
                const totalDuration = Math.floor((flight.endTime - flight.startTime) / 1000);
                const progressPercent = totalDuration > 0
                  ? Math.min(100, ((totalDuration - remaining) / totalDuration) * 100)
                  : 0;

                return (
                  <div key={flight.id}
                    className={`rounded-xl p-3.5 ${t.bg.card} border ${isDark ? 'border-green-500/20' : 'border-green-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-green-500 animate-pulse" />
                        <div>
                          <p className={`text-sm font-bold ${t.text.primary}`}>{flight.aircraftName}</p>
                          <p className="text-[10px] text-green-500 font-medium">
                            {formatCurrency(flight.incomePerHour)}/hr
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-orange-500" />
                          <span className="text-sm font-bold text-orange-500">{formatTime(remaining)}</span>
                        </div>
                        <p className={`text-[9px] ${t.text.tertiary}`}>remaining</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div className="h-full rounded-full bg-green-500 transition-all duration-1000"
                        style={{ width: `${progressPercent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══ AVAILABLE AIRCRAFT ═══ */}
        {availableAircraft.length > 0 && (
          <div>
            <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
              🛬 Available Aircraft ({availableAircraft.length})
            </p>
            <div className="space-y-2">
              {availableAircraft.map(aircraft => {
                const flightCheck = canStartFlight(biz, aircraft.id);
                const flightDuration = getFlightDuration(aircraft.range);

                return (
                  <div key={aircraft.id}
                    className={`rounded-xl p-3.5 ${t.bg.card} border ${t.border.default}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{aircraft.image}</span>
                        <div>
                          <p className={`text-sm font-bold ${t.text.primary}`}>{aircraft.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] ${t.text.tertiary}`}>
                              {aircraft.capacity} seats • {aircraft.range}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-500">
                          {formatCurrency(aircraft.incomePerHour)}/hr
                        </p>
                        <p className={`text-[9px] ${t.text.tertiary}`}>
                          Flight: {formatTime(flightDuration)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] ${t.text.tertiary}`}>
                        Flights completed: {aircraft.flightCount || 0}
                      </span>
                    </div>

                    {flightCheck.canStart ? (
                      <button onClick={() => handleStartFlight(aircraft.id)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold
                          bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 active:scale-95">
                        <Play className="w-4 h-4" />
                        Start Flight
                      </button>
                    ) : (
                      <div className={`flex items-center gap-2 py-2.5 px-3 rounded-xl
                        ${isDark ? 'bg-red-500/10' : 'bg-red-50'}`}>
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-[10px] font-medium text-red-400">{flightCheck.reason}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* No Aircraft */}
        {allAircraft.length === 0 && (
          <div className={`text-center py-12 rounded-xl border border-dashed ${t.border.default}`}>
            <Plane className={`w-10 h-10 mx-auto mb-3 ${t.text.tertiary}`} />
            <p className={`text-sm font-medium ${t.text.secondary}`}>No aircraft yet</p>
            <p className={`text-xs mt-1 ${t.text.tertiary}`}>Purchase aircraft to start flights</p>
            <button onClick={() => navigate(`/business/airline/${bizId}/aircraft`)}
              className="mt-4 px-4 py-2 rounded-xl text-sm font-bold bg-sky-500 text-white active:scale-95">
              Buy Aircraft
            </button>
          </div>
        )}
      </div>

      <AdSpace />
    </div>
  );
}

export default FlightOperations;