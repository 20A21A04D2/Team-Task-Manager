import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  FiPlus, 
  FiTrash2, 
  FiEdit2, 
  FiArrowLeft, 
  FiCalendar, 
  FiUser, 
  FiCheckCircle, 
  FiChevronLeft, 
  FiChevronRight,
  FiSearch,
  FiFilter,
  FiMessageSquare,
  FiPaperclip,
  FiUploadCloud,
  FiAlertTriangle
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const taskSchema = yup.object().shape({
  title: yup.string().required('Task title is required').min(3, 'Must be at least 3 characters'),
  description: yup.string().optional(),
  status: yup.string().oneOf(['Todo', 'In Progress', 'Review', 'Completed']).required(),
  priority: yup.string().oneOf(['Low', 'Medium', 'High', 'Critical']).required(),
  dueDate: yup.string().nullable().optional(),
  assigneeId: yup.string().nullable().optional(),
});

const ProjectDetails = () => {
  const { id: projectId } = useParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Modals state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskSubmitLoading, setTaskSubmitLoading] = useState(false);

  // Detail Modal (Comments & Attachments) state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  // Simulated Attachments
  const [attachments, setAttachments] = useState([
    { id: 1, name: 'api_design_document.pdf', size: '1.2 MB', date: '2026-05-18' },
    { id: 2, name: 'architecture_diagram.png', size: '840 KB', date: '2026-05-19' }
  ]);
  const [newAttachmentName, setNewAttachmentName] = useState('');

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      status: 'Todo',
      priority: 'Medium',
      assigneeId: ''
    }
  });

  const fetchProjectDetails = useCallback(async () => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      if (res.data.success) {
        setProject(res.data.project);
      }
    } catch (error) {
      console.error('Error fetching project details', error);
      toast.error('Failed to load project board');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const fetchTeamMembers = useCallback(async () => {
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.error('Error fetching team members', error);
    }
  }, []);

  useEffect(() => {
    fetchProjectDetails();
    fetchTeamMembers();
  }, [fetchProjectDetails, fetchTeamMembers]);

  const handleOpenCreateTaskModal = (initialStatus = 'Todo') => {
    setEditingTask(null);
    reset({
      title: '',
      description: '',
      status: initialStatus,
      priority: 'Medium',
      dueDate: '',
      assigneeId: ''
    });
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task, e) => {
    if (e) e.stopPropagation();
    setEditingTask(task);
    reset({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate || '',
      assigneeId: task.assigneeId || ''
    });
    setIsTaskModalOpen(true);
  };

  const handleCreateOrUpdateTask = async (data) => {
    setTaskSubmitLoading(true);
    try {
      if (editingTask) {
        const res = await api.put(`/tasks/${editingTask.id}`, data);
        if (res.data.success) {
          toast.success('Task updated successfully');
          fetchProjectDetails();
          setIsTaskModalOpen(false);
        }
      } else {
        const res = await api.post('/tasks', { ...data, projectId });
        if (res.data.success) {
          toast.success('Task added to board');
          fetchProjectDetails();
          setIsTaskModalOpen(false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setTaskSubmitLoading(false);
    }
  };

  const handleDeleteTask = async (taskId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const res = await api.delete(`/tasks/${taskId}`);
        if (res.data.success) {
          toast.success('Task deleted');
          fetchProjectDetails();
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete task');
      }
    }
  };

  const handleQuickStatusChange = async (task, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.put(`/tasks/${task.id}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Task moved to ${newStatus}`);
        fetchProjectDetails();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update task status');
    }
  };

  // Task detail card / comments logic
  const handleOpenTaskDetails = async (task) => {
    setSelectedTask(task);
    setComments([]);
    setCommentContent('');
    setIsDetailModalOpen(true);

    try {
      const res = await api.get(`/tasks/${task.id}`);
      if (res.data.success) {
        setComments(res.data.task.comments || []);
      }
    } catch (error) {
      console.error('Error fetching comments', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setCommentLoading(true);

    try {
      const res = await api.post(`/tasks/${selectedTask.id}/comments`, {
        content: commentContent
      });

      if (res.data.success) {
        setComments(prev => [...prev, res.data.comment]);
        setCommentContent('');
        toast.success('Comment added');
      }
    } catch (error) {
      console.error('Failed to add comment', error);
      toast.error('Could not submit comment');
    } finally {
      setCommentLoading(false);
    }
  };

  // Upload file mockup handler
  const handleAddAttachment = (e) => {
    e.preventDefault();
    if (!newAttachmentName.trim()) return;

    const newFile = {
      id: Date.now(),
      name: newAttachmentName,
      size: '250 KB',
      date: new Date().toISOString().split('T')[0]
    };

    setAttachments(prev => [...prev, newFile]);
    setNewAttachmentName('');
    toast.success('Mock attachment loaded');
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Project board not found.</p>
        <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-brand-400 hover:underline">
          <FiArrowLeft /> Back to projects
        </Link>
      </div>
    );
  }

  // Filter Tasks locally before compiling lanes
  const filteredTasks = (project.tasks || []).filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  // Compiled Lanes
  const lanes = {
    'Todo': filteredTasks.filter(t => t.status === 'Todo'),
    'In Progress': filteredTasks.filter(t => t.status === 'In Progress'),
    'Review': filteredTasks.filter(t => t.status === 'Review'),
    'Completed': filteredTasks.filter(t => t.status === 'Completed'),
  };

  const laneOrder = ['Todo', 'In Progress', 'Review', 'Completed'];

  return (
    <div className="space-y-6">
      {/* Back button & header metadata */}
      <div className="flex flex-col gap-4">
        <Link 
          to="/projects" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-muted hover:text-text-main transition duration-150 uppercase tracking-wider"
        >
          <FiArrowLeft size={14} />
          Back to Projects Portfolio
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-text-heading font-heading tracking-tight">
              {project.name}
            </h1>
            <p className="text-text-muted text-sm mt-1 max-w-2xl leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mt-2 lg:mt-0">
            <span className="text-xs px-3 py-1 bg-bg-surface border border-border-color rounded-lg text-text-muted font-medium">
              Owner: <strong className="text-text-heading">{project.owner?.name}</strong>
            </span>
            <span className="text-xs px-3 py-1 bg-bg-surface border border-border-color rounded-lg text-text-muted font-medium">
              Status: <strong className="text-brand-400">{project.status}</strong>
            </span>
          </div>
        </div>
      </div>

      <hr className="border-border-color my-2" />

      {/* Filter controllers panel */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-bg-surface/40 p-3 sm:p-4 border border-border-color rounded-xl">
        <div className="flex flex-1 items-center gap-2 bg-bg-main border border-border-color rounded-lg px-3 py-2">
          <FiSearch className="text-text-muted shrink-0" size={14} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-text-heading focus:outline-none placeholder-text-muted"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-text-muted font-semibold uppercase shrink-0">
            <FiFilter size={13} />
            Priority:
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-bg-main border border-border-color px-3 py-2 rounded-lg text-xs text-text-main focus:outline-none"
          >
            <option value="All">All</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban Board — horizontal scroll on mobile */}
      <div className="overflow-x-auto pb-4 -mx-4 sm:mx-0">
        <div className="flex gap-4 px-4 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 min-w-max sm:min-w-0">
          {laneOrder.map((laneTitle) => {
          const tasks = lanes[laneTitle] || [];
          const laneColors = {
            'Todo': 'border-indigo-500/30 bg-indigo-500/5',
            'In Progress': 'border-yellow-500/30 bg-yellow-500/5',
            'Review': 'border-pink-500/30 bg-pink-500/5',
            'Completed': 'border-emerald-500/30 bg-emerald-500/5',
          };
          
          return (
            <div 
              key={laneTitle} 
              className={`glass-panel border-t-2 rounded-xl flex flex-col w-72 sm:w-auto flex-shrink-0 sm:flex-shrink max-h-[70vh] ${laneColors[laneTitle]}`}
            >
              {/* Lane Header */}
              <div className="px-4 py-3 border-b border-border-color flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    laneTitle === 'Todo' ? 'bg-indigo-500' :
                    laneTitle === 'In Progress' ? 'bg-yellow-500' :
                    laneTitle === 'Review' ? 'bg-pink-500' :
                    'bg-emerald-500'
                  }`} />
                  <h3 className="font-bold font-heading text-text-heading text-sm">{laneTitle}</h3>
                  <span className="px-1.5 py-0.5 text-xs font-bold bg-bg-surface border border-border-color text-text-muted rounded-md">
                    {tasks.length}
                  </span>
                </div>
                <button
                  onClick={() => handleOpenCreateTaskModal(laneTitle)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface transition"
                  title="Add Task"
                >
                  <FiPlus size={16} />
                </button>
              </div>

              {/* Task Items */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[150px]">
                {tasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center py-8 text-center">
                    <p className="text-xs text-text-muted font-medium">No tasks here.</p>
                  </div>
                ) : (
                  tasks.map((task) => {
                    const priorityDot = {
                      Critical: 'bg-red-600',
                      High: 'bg-red-500',
                      Medium: 'bg-yellow-500',
                      Low: 'bg-blue-500',
                    };

                    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

                    return (
                      <div 
                        key={task.id}
                        onClick={() => handleOpenTaskDetails(task)}
                        className={`p-3 bg-bg-main/60 border rounded-lg shadow-sm transition group cursor-pointer ${
                          isOverdue ? 'border-red-500/40 ring-1 ring-red-500/10' : 'border-border-color hover:border-brand-500/30'
                        }`}
                      >
                        {/* Title & action icons */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="font-bold text-sm text-text-heading line-clamp-2 leading-snug group-hover:text-brand-500 transition flex-1">
                            {task.title}
                          </h4>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition shrink-0">
                            <button 
                              onClick={(e) => handleOpenEditTaskModal(task, e)}
                              className="p-1 rounded text-text-muted hover:text-text-heading hover:bg-bg-surface transition"
                              title="Edit"
                            >
                              <FiEdit2 size={11} />
                            </button>
                            <button 
                              onClick={(e) => handleDeleteTask(task.id, e)}
                              className="p-1 rounded text-text-muted hover:text-red-500 hover:bg-red-500/5 transition"
                              title="Delete"
                            >
                              <FiTrash2 size={11} />
                            </button>
                          </div>
                        </div>

                        {task.description && (
                          <p className="text-xs text-text-muted line-clamp-2 mb-2 leading-relaxed">{task.description}</p>
                        )}

                        {isOverdue && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-red-500 mb-2">
                            <FiAlertTriangle size={11} />
                            <span>Overdue</span>
                          </div>
                        )}

                        {/* Assignee & Date */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-color mt-2 text-[11px]">
                          <div className="flex items-center gap-1 text-text-muted">
                            <FiUser size={11} />
                            <span className="truncate max-w-[70px]">{task.assignee ? task.assignee.name : 'None'}</span>
                          </div>
                          {task.dueDate && (
                            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500' : 'text-text-muted'}`}>
                              <FiCalendar size={11} />
                              <span>{task.dueDate}</span>
                            </div>
                          )}
                        </div>

                        {/* Priority + move controls */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border-color" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${priorityDot[task.priority]}`} />
                            <span className="text-[10px] text-text-muted font-bold uppercase">{task.priority}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {task.status !== 'Todo' && (
                              <button 
                                onClick={(e) => { const i = laneOrder.indexOf(task.status); handleQuickStatusChange(task, laneOrder[i - 1], e); }}
                                className="p-1 text-text-muted hover:text-text-heading hover:bg-bg-surface rounded transition"
                                title="Move Back"
                              >
                                <FiChevronLeft size={13} />
                              </button>
                            )}
                            {task.status !== 'Completed' && (
                              <button 
                                onClick={(e) => { const i = laneOrder.indexOf(task.status); handleQuickStatusChange(task, laneOrder[i + 1], e); }}
                                className="p-1 text-text-muted hover:text-text-heading hover:bg-bg-surface rounded transition"
                                title="Move Forward"
                              >
                                <FiChevronRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Task Creation/Editing Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title={editingTask ? 'Edit Work Item' : 'Add New Task'}
      >
        <form onSubmit={handleSubmit(handleCreateOrUpdateTask)} className="space-y-4">
          <Input
            label="Task Title"
            name="title"
            placeholder="e.g., Setup auth controllers"
            error={errors.title}
            {...register('title')}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-description" className="text-xs font-semibold text-text-muted tracking-wide uppercase">
              Task Description
            </label>
            <textarea
              id="task-description"
              placeholder="Provide context or instructions for this task..."
              rows={3}
              className="w-full px-4 py-2.5 bg-bg-surface border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-heading placeholder-text-muted focus:outline-none focus:ring-4 transition duration-200"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-status" className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                Status
              </label>
              <select
                id="task-status"
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-heading focus:outline-none focus:ring-4 transition duration-200"
                {...register('status')}
              >
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="task-priority" className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                Priority
              </label>
              <select
                id="task-priority"
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-heading focus:outline-none focus:ring-4 transition duration-200"
                {...register('priority')}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Due Date"
              name="dueDate"
              type="date"
              error={errors.dueDate}
              {...register('dueDate')}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="assigneeId" className="text-xs font-semibold text-text-muted tracking-wide uppercase">
                Assignee
              </label>
              <select
                id="assigneeId"
                className="w-full px-4 py-2.5 bg-bg-surface border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-heading focus:outline-none focus:ring-4 transition duration-200"
                {...register('assigneeId')}
              >
                <option value="">Unassigned</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setIsTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={taskSubmitLoading}>
              {editingTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Task Details, Comments, and Attachments Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedTask?.title || 'Work Item Details'}
      >
        <div className="space-y-6">
          {/* Metadata details */}
          <div className="bg-bg-surface/40 p-4 border border-border-color rounded-xl grid grid-cols-2 gap-4 text-xs font-medium text-text-muted">
            <div>
              <span className="block text-text-muted uppercase tracking-wide mb-0.5">Assigned To</span>
              <span className="text-text-heading text-sm font-bold flex items-center gap-1.5">
                <FiUser /> {selectedTask?.assignee ? selectedTask.assignee.name : 'Unassigned'}
              </span>
            </div>
            <div>
              <span className="block text-text-muted uppercase tracking-wide mb-0.5">Due Date</span>
              <span className="text-text-heading text-sm font-bold flex items-center gap-1.5">
                <FiCalendar /> {selectedTask?.dueDate || 'No Due Date'}
              </span>
            </div>
            <div>
              <span className="block text-text-muted uppercase tracking-wide mb-0.5">Status</span>
              <span className="px-2 py-0.5 bg-brand-500/10 text-brand-400 rounded font-bold uppercase tracking-wider text-[10px] self-start inline-block">
                {selectedTask?.status}
              </span>
            </div>
            <div>
              <span className="block text-text-muted uppercase tracking-wide mb-0.5">Priority</span>
              <span className="px-2 py-0.5 bg-red-500/10 text-red-400 rounded font-bold uppercase tracking-wider text-[10px] self-start inline-block">
                {selectedTask?.priority}
              </span>
            </div>
          </div>

          {/* Description */}
          {selectedTask?.description && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide">Description</h4>
              <p className="text-sm text-text-main bg-bg-main/50 p-3 rounded-lg border border-border-color leading-relaxed">
                {selectedTask.description}
              </p>
            </div>
          )}

          {/* Attachments Section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
              <FiPaperclip />
              Task Assets & Attachments
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto divide-y divide-border-color">
              {attachments.map((file) => (
                <div key={file.id} className="py-2 flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <FiPaperclip className="text-text-muted" />
                    <span className="text-text-main truncate max-w-[200px]">{file.name}</span>
                  </div>
                  <span className="text-text-muted">{file.size}</span>
                </div>
              ))}
            </div>
            <form onSubmit={handleAddAttachment} className="flex gap-2">
              <input
                type="text"
                placeholder="mock_attachment_file.zip"
                value={newAttachmentName}
                onChange={(e) => setNewAttachmentName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-bg-main border border-border-color rounded-lg text-xs text-text-heading focus:outline-none placeholder-slate-600"
              />
              <Button type="submit" size="sm" className="flex items-center gap-1">
                <FiUploadCloud /> Upload
              </Button>
            </form>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2 border-t border-border-color">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide flex items-center gap-1.5">
              <FiMessageSquare />
              Discussion Feed
            </h4>

            {/* Comment list */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {comments.length === 0 ? (
                <p className="text-text-muted text-xs italic py-2">No comments posted yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-bg-surface/20 border border-border-color p-2.5 rounded-lg text-xs space-y-1.5">
                    <div className="flex justify-between items-center text-text-muted">
                      <span className="font-bold text-text-main">{comment.user?.name}</span>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-text-heading leading-relaxed font-medium">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment input form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a status update..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                className="flex-1 px-4 py-2 bg-bg-main border border-border-color rounded-lg text-xs text-text-heading focus:outline-none focus:ring-1 focus:ring-brand-500 placeholder-text-muted"
                required
              />
              <Button type="submit" size="sm" loading={commentLoading}>
                Submit
              </Button>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetails;
