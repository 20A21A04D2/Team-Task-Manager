import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiPlus, FiFolder, FiTrash2, FiEdit2, FiExternalLink, FiUsers, FiUserMinus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const schema = yup.object().shape({
  name: yup.string().required('Project name is required').min(3, 'Must be at least 3 characters'),
  description: yup.string().optional(),
  status: yup.string().oneOf(['Planning', 'Active', 'Completed']).required()
});

const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  
  // Project creation/edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Members modal state
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Collaborator');
  const [addMemberLoading, setAddMemberLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      status: 'Planning'
    }
  });

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects');
      if (res.data.success) {
        setProjects(res.data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    reset({
      name: '',
      description: '',
      status: 'Planning'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project, e) => {
    e.stopPropagation();
    setEditingProject(project);
    setValue('name', project.name);
    setValue('description', project.description || '');
    setValue('status', project.status);
    setIsModalOpen(true);
  };

  const handleCreateOrUpdate = async (data) => {
    setSubmitLoading(true);
    try {
      if (editingProject) {
        const res = await api.put(`/projects/${editingProject.id}`, data);
        if (res.data.success) {
          toast.success('Project updated successfully');
          fetchProjects();
          setIsModalOpen(false);
        }
      } else {
        const res = await api.post('/projects', data);
        if (res.data.success) {
          toast.success('Project created successfully');
          fetchProjects();
          setIsModalOpen(false);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Action failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project? All associated tasks will be lost.')) {
      try {
        const res = await api.delete(`/projects/${id}`);
        if (res.data.success) {
          toast.success('Project deleted successfully');
          setProjects(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete project');
      }
    }
  };

  // Members Modal handlers
  const handleOpenMembersModal = async (project, e) => {
    e.stopPropagation();
    setSelectedProject(project);
    setProjectMembers([]);
    setNewMemberEmail('');
    setNewMemberRole('Collaborator');
    setIsMembersModalOpen(true);
    setMembersLoading(true);

    try {
      const res = await api.get(`/projects/${project.id}`);
      if (res.data.success) {
        setProjectMembers(res.data.project.members || []);
      }
    } catch (error) {
      console.error('Error fetching project details for members', error);
      toast.error('Failed to load project team members');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    setAddMemberLoading(true);

    try {
      const res = await api.post(`/projects/${selectedProject.id}/members`, {
        email: newMemberEmail,
        role: newMemberRole
      });

      if (res.data.success) {
        toast.success('Team member added');
        setNewMemberEmail('');
        
        // Reload member roster
        const detailsRes = await api.get(`/projects/${selectedProject.id}`);
        if (detailsRes.data.success) {
          setProjectMembers(detailsRes.data.project.members || []);
        }
      }
    } catch (error) {
      console.error('Error adding member to project', error);
      toast.error(error.response?.data?.message || 'Add member action failed');
    } finally {
      setAddMemberLoading(false);
    }
  };

  const handleRemoveMember = async (targetUserId) => {
    if (window.confirm('Are you sure you want to remove this member from the project?')) {
      try {
        const res = await api.delete(`/projects/${selectedProject.id}/members/${targetUserId}`);
        if (res.data.success) {
          toast.success('Member removed from project');
          setProjectMembers(prev => prev.filter(m => m.id !== targetUserId));
        }
      } catch (error) {
        console.error('Error removing project member', error);
        toast.error(error.response?.data?.message || 'Failed to remove member');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-text-heading font-heading tracking-tight">
            Projects Portfolio
          </h1>
          <p className="text-sm text-text-muted font-medium">
            Manage your workspaces, track deliverables, and structure workflows.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="self-start sm:self-auto flex items-center gap-2">
          <FiPlus size={16} />
          Create Project
        </Button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl">
          <div className="w-16 h-16 mx-auto bg-bg-surface rounded-2xl flex items-center justify-center text-text-muted mb-4 border border-border-color">
            <FiFolder size={28} />
          </div>
          <h3 className="text-lg font-bold text-text-heading font-heading">No Projects Found</h3>
          <p className="text-sm text-text-muted mt-2 max-w-sm mx-auto">
            Get started by creating your first team workspace project.
          </p>
          <Button onClick={handleOpenCreateModal} className="mt-6 flex items-center gap-2 mx-auto">
            <FiPlus size={16} />
            Create Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const hasModifyAuth = project.ownerId === user?.id || user?.role === 'Admin';
            
            const statusColors = {
              Planning: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
              Active: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
              Completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            };

            return (
              <div 
                key={project.id} 
                className="glass-panel rounded-xl p-6 flex flex-col h-full hover:border-border-color hover:shadow-xl transition-all duration-300"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full border ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                  <div className="flex items-center gap-1">
                    {hasModifyAuth && (
                      <>
                        <button 
                          onClick={(e) => handleOpenMembersModal(project, e)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface/50 transition"
                          title="Manage Members"
                        >
                          <FiUsers size={14} />
                        </button>
                        <button 
                          onClick={(e) => handleOpenEditModal(project, e)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-text-heading hover:bg-bg-surface/50 transition"
                          title="Edit Project"
                        >
                          <FiEdit2 size={13} />
                        </button>
                        <button 
                          onClick={(e) => handleDelete(project.id, e)}
                          className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/5 transition"
                          title="Delete Project"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-text-heading font-heading mb-2 tracking-tight line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-text-muted text-sm line-clamp-3 mb-4 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                {/* Footer details */}
                <div className="pt-4 border-t border-border-color mt-6 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-text-muted font-semibold block uppercase">Owner</span>
                    <span className="text-text-main font-medium truncate max-w-[120px] block">{project.owner?.name}</span>
                  </div>
                  <div className="text-xs text-right">
                    <span className="text-text-muted font-semibold block uppercase">Tasks</span>
                    <span className="text-text-heading font-bold">{project.tasks?.length || 0} active</span>
                  </div>
                </div>

                <Button 
                  onClick={() => navigate(`/projects/${project.id}`)}
                  variant="secondary"
                  className="w-full mt-5 flex items-center justify-center gap-2 group"
                >
                  View Tasks Board
                  <FiExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-150" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Creation/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Edit Project Settings' : 'Create New Project'}
      >
        <form onSubmit={handleSubmit(handleCreateOrUpdate)} className="space-y-5">
          <Input
            label="Project Name"
            name="name"
            placeholder="e.g., Q3 Launch Roadmap"
            error={errors.name}
            {...register('name')}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-xs font-semibold text-text-muted tracking-wide uppercase">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Provide a detailed roadmap or description of the project workspace..."
              rows={4}
              className="w-full px-4 py-2.5 bg-bg-surface border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-main placeholder-text-muted focus:outline-none focus:ring-4 transition duration-200"
              {...register('description')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="status" className="text-xs font-semibold text-text-muted tracking-wide uppercase">
              Project Status
            </label>
            <select
              id="status"
              className="w-full px-4 py-2.5 bg-bg-surface border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-main focus:outline-none focus:ring-4 transition duration-200"
              {...register('status')}
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={submitLoading}>
              {editingProject ? 'Save Changes' : 'Create Project'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Project Members Modal */}
      <Modal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        title={`Manage Members: ${selectedProject?.name}`}
      >
        <div className="space-y-6">
          {/* Add Member form */}
          <form onSubmit={handleAddMember} className="bg-bg-surface/40 p-4 border border-border-color rounded-xl space-y-4">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide">Invite New Collaborator</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="email"
                  placeholder="collaborator@company.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-main border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-main text-sm placeholder-text-muted focus:outline-none focus:ring-4 transition"
                  required
                />
              </div>
              <div>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-bg-main border border-border-color focus:border-brand-500 focus:ring-brand-500/20 rounded-lg text-text-main text-sm focus:outline-none focus:ring-4 transition"
                >
                  <option value="Collaborator">Collaborator</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" loading={addMemberLoading}>
                Add to Project
              </Button>
            </div>
          </form>

          {/* Members List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-text-muted uppercase tracking-wide">Project Team Roster</h4>
            {membersLoading ? (
              <div className="flex justify-center py-6">
                <Spinner size="sm" />
              </div>
            ) : projectMembers.length === 0 ? (
              <p className="text-text-muted text-xs py-4 text-center">No active members found.</p>
            ) : (
              <div className="max-h-48 overflow-y-auto divide-y divide-border-color pr-1">
                {projectMembers.map((member) => {
                  const isProjectOwner = member.ProjectMember?.role === 'Owner' || member.id === selectedProject?.ownerId;
                  return (
                    <div key={member.id} className="py-2.5 flex items-center justify-between gap-4 text-sm first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-bg-surface flex items-center justify-center text-xs font-bold text-brand-500 border border-border-color">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="block font-semibold text-text-heading">{member.name}</span>
                          <span className="block text-[10px] text-text-muted">{member.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isProjectOwner 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                            : 'bg-bg-surface text-text-muted border border-border-color'
                        }`}>
                          {member.ProjectMember?.role || 'Collaborator'}
                        </span>
                        {!isProjectOwner && (
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded transition"
                            title="Remove Member"
                          >
                            <FiUserMinus size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;
