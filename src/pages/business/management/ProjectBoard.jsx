// src/pages/business/management/ProjectBoard.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  FolderKanban, Play, Check, Clock, AlertTriangle,
  Package, Users, Gift
} from 'lucide-react';
import { useTheme } from '../../../hooks/useTheme';
import { theme } from '../../../design/tokens';
import { useGame } from '../../../hooks/useGame';
import {
  CONSTRUCTION_PROJECTS, CONSTRUCTION_RESOURCES,
  IT_PROJECTS
} from '../../../data/businessRequirements';
import { formatCurrency, formatNumber } from '../../../utils/formatCurrency';
import { formatTime } from '../../../utils/formatTime';
import ManagementHeader from '../../../components/business/ManagementHeader';
import AdSpace from '../../../components/common/AdSpace';

function ProjectBoard() {
  const { bizId } = useParams();
  const { isDark } = useTheme();
  const t = isDark ? theme.dark : theme.light;
  const { ownedBusinesses, balance, startProject, collectProjectReward, buyResources } = useGame();

  const biz = ownedBusinesses.find(b => b.id === bizId);
  const [tab, setTab] = useState('projects');
  const [resourceQty, setResourceQty] = useState({});
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(p => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!biz) {
    return (
      <div className={`h-screen flex items-center justify-center ${t.bg.primary}`}>
        <p className={t.text.secondary}>Not found</p>
      </div>
    );
  }

  const isConstruction = biz.categoryId === 'construction';
  const isIT = biz.categoryId === 'it-company';
  const projects = isConstruction ? CONSTRUCTION_PROJECTS : IT_PROJECTS;
  const activeProjects = (biz.projects || []).filter(p => p.status === 'active');
  const completedProjects = (biz.projects || []).filter(p => p.status === 'completed');
  const resources = biz.resources || {};
  const staff = biz.staff || {};

  const canStartProject = (project) => {
    // Check active project limit (max 3)
    if (activeProjects.length >= 3) return false;

    if (project.resources) {
      return Object.entries(project.resources).every(
        ([resId, qty]) => (resources[resId] || 0) >= qty
      );
    }
    if (project.requirements) {
      return Object.entries(project.requirements).every(
        ([role, count]) => (staff[role] || 0) >= count
      );
    }
    return false;
  };

  const getResQty = (id) => resourceQty[id] || 10;
  const setResQty = (id, val) => setResourceQty(prev => ({ ...prev, [id]: Math.max(1, val) }));

  return (
    <div className={`h-screen flex flex-col ${t.bg.primary} transition-colors duration-300`}>
      <ManagementHeader
        bizId={bizId}
        title="Projects"
        subtitle={`${activeProjects.length} active • ${completedProjects.length} completed`}
        icon={FolderKanban}
        iconColor="text-purple-500"
      />

      <div className="flex-1 min-h-0 flex flex-col">
        {/* Tabs */}
        {isConstruction && (
          <div className="flex-shrink-0 flex gap-1.5 px-3 pt-3">
            {[
              { id: 'projects', label: 'Projects' },
              { id: 'resources', label: 'Resources' },
            ].map(t2 => (
              <button key={t2.id} onClick={() => setTab(t2.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all
                  ${tab === t2.id
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                    : isDark ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }`}>
                {t2.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide px-3 py-3 space-y-3">
          {/* Completed Projects (Collect Reward) */}
          {completedProjects.length > 0 && tab === 'projects' && (
            <div>
              <p className={`text-xs font-bold mb-2 text-green-500`}>
                ✅ Collect Rewards ({completedProjects.length})
              </p>
              {completedProjects.map(proj => (
                <button key={proj.id}
                  onClick={() => collectProjectReward(bizId, proj.id)}
                  className={`w-full flex items-center justify-between p-3.5 mb-2 rounded-xl
                    transition-all active:scale-[0.98]
                    ${isDark ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                  <div className="flex items-center gap-2.5">
                    <Gift className="w-5 h-5 text-green-500" />
                    <div>
                      <p className={`text-sm font-bold ${t.text.primary}`}>{proj.name}</p>
                      <p className="text-[10px] text-green-500">Tap to collect</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-green-500">
                    +{formatCurrency(proj.reward)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Active Projects */}
          {activeProjects.length > 0 && tab === 'projects' && (
            <div>
              <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>
                Active Projects ({activeProjects.length}/3)
              </p>
              {activeProjects.map(proj => {
                const remaining = Math.max(0, Math.floor((proj.endTime - Date.now()) / 1000));
                const total = Math.floor((proj.endTime - proj.startTime) / 1000);
                const progress = total > 0 ? ((total - remaining) / total * 100) : 100;

                return (
                  <div key={proj.id}
                    className={`rounded-xl p-3.5 mb-2 ${t.bg.card} border ${t.border.default}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-bold ${t.text.primary}`}>{proj.name}</p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-400" />
                        <span className="text-[10px] font-bold text-orange-400">
                          {formatTime(remaining)}
                        </span>
                      </div>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden
                      ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500
                        transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className={`text-[10px] ${t.text.tertiary}`}>
                        {progress.toFixed(0)}% complete
                      </span>
                      <span className={`text-[10px] font-bold ${t.text.brand}`}>
                        Reward: {formatCurrency(proj.reward)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Available Projects */}
          {tab === 'projects' && (
            <div>
              <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>Available Projects</p>
              {projects.map(project => {
                const canStart = canStartProject(project);
                const alreadyActive = activeProjects.some(p => p.projectId === project.id);

                return (
                  <div key={project.id}
                    className={`rounded-xl p-4 mb-2.5 ${t.bg.card} border ${t.border.default}`}>
                    
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-bold ${t.text.primary}`}>{project.name}</p>
                      <span className="text-sm font-black text-green-500">
                        {formatCurrency(project.reward)}
                      </span>
                    </div>

                    <div className={`flex items-center gap-1.5 mb-3 px-2 py-1 rounded-lg
                      ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span className={`text-[10px] ${t.text.tertiary}`}>
                        Duration: {formatTime(project.duration)}
                      </span>
                    </div>

                    {/* Requirements */}
                    <div className="space-y-1 mb-3">
                      <p className={`text-[10px] font-semibold ${t.text.tertiary}`}>REQUIREMENTS:</p>
                      {project.resources && Object.entries(project.resources).map(([resId, qty]) => {
                        const res = CONSTRUCTION_RESOURCES.find(r => r.id === resId);
                        const have = resources[resId] || 0;
                        const enough = have >= qty;
                        return (
                          <div key={resId} className="flex items-center justify-between">
                            <span className={`text-[10px] ${t.text.secondary}`}>
                              {res?.icon} {res?.name || resId}
                            </span>
                            <span className={`text-[10px] font-bold
                              ${enough ? 'text-green-500' : 'text-red-400'}`}>
                              {formatNumber(have)}/{formatNumber(qty)} {res?.unit || ''}
                            </span>
                          </div>
                        );
                      })}
                      {project.requirements && Object.entries(project.requirements).map(([role, count]) => {
                        const have = staff[role] || 0;
                        const enough = have >= count;
                        return (
                          <div key={role} className="flex items-center justify-between">
                            <span className={`text-[10px] capitalize ${t.text.secondary}`}>
                              <Users className="w-3 h-3 inline mr-1" />
                              {role.replace(/_/g, ' ')}
                            </span>
                            <span className={`text-[10px] font-bold
                              ${enough ? 'text-green-500' : 'text-red-400'}`}>
                              {have}/{count}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => startProject(bizId, project)}
                      disabled={!canStart || alreadyActive}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                        ${alreadyActive
                          ? isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                          : canStart
                            ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/20 active:scale-95'
                            : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                        }`}>
                      {alreadyActive ? 'Already Active' : canStart ? 'Start Project' : 'Requirements Not Met'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Resources Tab (Construction only) */}
          {tab === 'resources' && isConstruction && (
            <div>
              <p className={`text-xs font-bold mb-2 ${t.text.secondary}`}>Buy Resources</p>
              <div className={`rounded-xl p-3 mb-3 ${t.bg.card} border ${t.border.default}`}>
                <p className={`text-[10px] ${t.text.tertiary}`}>Balance</p>
                <p className={`text-xl font-black ${t.text.brand}`}>{formatCurrency(balance)}</p>
              </div>

              {CONSTRUCTION_RESOURCES.map(res => {
                const stock = resources[res.id] || 0;
                const qty = getResQty(res.id);
                const totalCost = qty * res.costPer;
                const canBuy = balance >= totalCost;

                return (
                  <div key={res.id}
                    className={`rounded-xl p-3.5 mb-2 ${t.bg.card} border ${t.border.default}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{res.icon}</span>
                        <div>
                          <p className={`text-sm font-bold ${t.text.primary}`}>{res.name}</p>
                          <p className={`text-[10px] ${t.text.tertiary}`}>
                            {formatCurrency(res.costPer)} per {res.unit}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${t.text.primary}`}>
                          {formatNumber(stock)}
                        </p>
                        <p className={`text-[10px] ${t.text.tertiary}`}>{res.unit} in stock</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setResQty(res.id, getResQty(res.id) - 10)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs
                            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          -
                        </button>
                        <input type="number" value={qty}
                          onChange={(e) => setResQty(res.id, parseInt(e.target.value) || 1)}
                          className={`w-16 h-7 rounded-lg text-center text-xs font-bold
                            outline-none border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                        />
                        <button onClick={() => setResQty(res.id, getResQty(res.id) + 10)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs
                            ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => { buyResources(bizId, res.id, qty, totalCost); setResQty(res.id, 10); }}
                        disabled={!canBuy}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all
                          ${canBuy
                            ? 'bg-green-500 text-white active:scale-95'
                            : isDark ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                          }`}>
                        Buy — {formatCurrency(totalCost)}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AdSpace />
    </div>
  );
}

export default ProjectBoard;