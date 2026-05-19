import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import { 
  FiFolder, 
  FiClock, 
  FiAlertCircle, 
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend 
} from 'recharts';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        if (res.data.success) setData(res.data);
      } catch (error) {
        toast.error('Failed to load dashboard metrics');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;
  if (!data) return <div className="text-center py-10 text-text-muted font-medium">Failed to load data. Please try reloading.</div>;

  const { stats, recentTasks, projectProgress, activityTimeline } = data;

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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-heading font-heading tracking-tight">Dashboard Analytics</h1>
        <p className="text-sm text-text-muted font-medium mt-1">Real-time metrics and team performance indicators.</p>
      </div>

      {/* Metrics Cards — 2 cols on mobile, 4 on lg */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Projects', value: stats.totalProjects, icon: <FiFolder size={20} />, color: 'indigo' },
          { label: 'Pending Tasks', value: stats.pendingTasks, icon: <FiTrendingUp size={20} />, color: 'blue' },
          { label: 'In Progress', value: stats.inProgressTasks, icon: <FiClock size={20} />, color: 'yellow' },
          { label: 'Overdue', value: stats.overdueTasks, icon: <FiAlertCircle size={20} />, color: 'red', valueClass: 'text-red-500' },
        ].map(({ label, value, icon, color, valueClass }) => (
          <div key={label} className="glass-panel p-4 sm:p-6 rounded-xl flex items-center justify-between shadow-lg gap-3">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-semibold text-text-muted tracking-wider uppercase block">{label}</span>
              <h3 className={`text-2xl sm:text-3xl font-bold mt-1 font-heading ${valueClass || 'text-text-heading'}`}>{value}</h3>
            </div>
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-500 shrink-0`}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Charts — stack on small, side-by-side on xl */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Status Bar Chart */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl shadow-lg xl:col-span-2">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-4">Task Status Distribution</h4>
          <div className="w-full h-56 sm:h-64">
            {stats.totalTasks === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted text-sm">No tasks available to chart</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskStatusData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} tickLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: 'var(--text-heading)', fontWeight: 'bold' }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {taskStatusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Priority Pie Chart */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-4">Priority Breakdown</h4>
          <div className="w-full h-56 sm:h-64 flex items-center justify-center">
            {taskPriorityData.length === 0 ? (
              <div className="text-text-muted text-sm">No task priorities recorded</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={taskPriorityData} cx="50%" cy="42%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                    {taskPriorityData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-main)', borderColor: 'var(--border-color)', borderRadius: '8px', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" height={36} iconSize={8} iconType="circle" formatter={(v) => <span className="text-xs text-text-muted font-medium">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Project Progress + Recent Tasks — stack on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-5">Active Projects Performance</h4>
          {projectProgress.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No active projects created yet.</p>
          ) : (
            <div className="space-y-4">
              {projectProgress.map(project => (
                <div key={project.id} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-text-main truncate max-w-[70%]">{project.name}</span>
                    <span className="text-brand-500 font-bold shrink-0 ml-2">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-bg-main border border-border-color rounded-full h-2">
                    <div className="bg-brand-500 h-2 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-text-muted font-semibold uppercase">
                    <span>{project.status}</span>
                    <span>{project.completedTasks} / {project.totalTasks} Done</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="glass-panel p-4 sm:p-6 rounded-xl shadow-lg">
          <h4 className="text-sm font-bold text-text-heading font-heading mb-5">Recent Work Items</h4>
          {recentTasks.length === 0 ? (
            <p className="text-text-muted text-sm py-4">No tasks found. Add a task to get started.</p>
          ) : (
            <div className="divide-y divide-border-color">
              {recentTasks.map(task => {
                const priorityColors = {
                  Critical: 'bg-red-500/10 text-red-500 border-red-500/20',
                  High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
                  Medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                  Low: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                };
                return (
                  <div key={task.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-text-heading truncate">{task.title}</span>
                      <span className="block text-xs text-text-muted font-medium truncate mt-0.5">{task.project?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded border hidden sm:inline ${priorityColors[task.priority] || priorityColors.Low}`}>
                        {task.priority}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                        task.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' :
                        task.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-500' :
                        task.status === 'Review' ? 'bg-pink-500/10 text-pink-500' :
                        'bg-indigo-500/10 text-indigo-500'
                      }`}>
                        {task.status === 'In Progress' ? 'Active' : task.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="glass-panel p-4 sm:p-6 rounded-xl shadow-lg">
        <h4 className="text-sm font-bold text-text-heading font-heading mb-5 flex items-center gap-2">
          <FiActivity className="text-brand-500" />
          Workspace Activity Log
        </h4>
        {activityTimeline.length === 0 ? (
          <p className="text-text-muted text-sm py-4">No system activities recorded yet.</p>
        ) : (
          <div className="relative border-l border-border-color ml-3 space-y-5">
            {activityTimeline.map((activity) => (
              <div key={activity.id} className="relative pl-5">
                <span className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-brand-500 ring-4 ring-bg-main border border-border-color" />
                <div className="text-xs text-text-muted leading-relaxed">
                  <span className="font-bold text-text-heading">{activity.user?.name}</span>
                  <span className="mx-1.5 text-brand-500 font-semibold">{activity.action}</span>
                  <span>at {new Date(activity.createdAt).toLocaleTimeString()}</span>
                  <p className="text-text-main font-medium mt-1 bg-bg-surface/50 p-2 rounded-lg border border-border-color break-words">{activity.details}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
