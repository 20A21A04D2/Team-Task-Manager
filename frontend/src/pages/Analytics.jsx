import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, PieChart, Pie, Legend
} from 'recharts';
import { FiTrendingUp, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) setData(res.data);
      } catch (error) {
        toast.error('Failed to load system metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  if (!data) return <div className="text-center py-10 text-text-muted">No analytics data available.</div>;

  const { stats, performance, teamProductivity } = data;

  const taskStatusData = [
    { name: 'Todo', count: stats.toDoTasks, fill: '#6366f1' },
    { name: 'In Progress', count: stats.inProgressTasks, fill: '#eab308' },
    { name: 'Review', count: stats.reviewTasks, fill: '#ec4899' },
    { name: 'Completed', count: stats.completedTasks, fill: '#10b981' }
  ];

  const taskPriorityData = [
    { name: 'Critical', value: stats.criticalPriorityTasks, color: '#ef4444' },
    { name: 'High', value: stats.highPriorityTasks, color: '#f97316' },
    { name: 'Medium', value: stats.mediumPriorityTasks, color: '#eab308' },
    { name: 'Low', value: stats.lowPriorityTasks, color: '#3b82f6' }
  ].filter(p => p.value > 0);

  const chartTooltipStyle = {
    contentStyle: { backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px' },
    labelStyle: { color: 'var(--text-heading)', fontWeight: 'bold' }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-heading font-heading tracking-tight">System Analytics</h1>
        <p className="text-sm text-text-muted font-medium mt-1">Deep metrics on task delivery rates and workload distribution.</p>
      </div>

      {/* Stat Cards — 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Completed', value: stats.completedTasks, icon: <FiCheckCircle size={20} />, color: 'emerald' },
          { label: 'Pending', value: stats.pendingTasks, icon: <FiClock size={20} />, color: 'yellow' },
          { label: 'Overdue', value: stats.overdueTasks, icon: <FiAlertCircle size={20} />, color: 'red', valueClass: 'text-red-500', pulse: true },
          { label: 'Total Tasks', value: stats.totalTasks, icon: <FiTrendingUp size={20} />, color: 'indigo' },
        ].map(({ label, value, icon, color, valueClass, pulse }) => (
          <div key={label} className="glass-panel p-4 sm:p-6 rounded-xl flex items-center justify-between shadow-lg gap-3">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-text-muted tracking-wider uppercase block">{label}</span>
              <h3 className={`text-2xl sm:text-3xl font-bold mt-1 font-heading ${valueClass || 'text-text-heading'}`}>{value}</h3>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-500 shrink-0 ${pulse ? 'animate-pulse' : ''}`}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Line Chart + Pie — stack on mobile, side by side on xl */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-panel p-4 sm:p-6 rounded-xl xl:col-span-2 shadow-lg">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-4">Weekly Performance History</h4>
          <div className="w-full h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-4 sm:p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-4">Priority Breakdown</h4>
          <div className="w-full h-56 sm:h-72 flex items-center justify-center">
            {taskPriorityData.length === 0 ? (
              <span className="text-text-muted text-sm">No priorities recorded</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskPriorityData} cx="50%" cy="42%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {taskPriorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" iconSize={8} iconType="circle" formatter={(v) => <span className="text-xs text-text-muted font-semibold">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Status Bar + Team Table */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="glass-panel p-4 sm:p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-4">Work Item Statuses</h4>
          <div className="w-full h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStatusData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {taskStatusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Team Productivity — scrollable table */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl xl:col-span-2 shadow-lg">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-4">Team Workload & Efficiency</h4>
          {teamProductivity.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No team workload registered yet.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="min-w-[400px] px-4 sm:px-0">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border-color text-text-muted font-semibold uppercase text-[10px] sm:text-[11px] tracking-wider">
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 pr-4">Assigned</th>
                      <th className="pb-3 pr-4">Completed</th>
                      <th className="pb-3 text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-color">
                    {teamProductivity.map((team) => (
                      <tr key={team.userId} className="text-text-main font-medium">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-bg-surface border border-border-color flex items-center justify-center text-xs font-bold text-brand-500 shrink-0">
                              {team.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="truncate max-w-[100px] sm:max-w-none">{team.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">{team.totalTasks}</td>
                        <td className="py-3 pr-4 text-emerald-500">{team.completedTasks}</td>
                        <td className="py-3 text-right font-bold text-brand-500">{team.efficiency}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
