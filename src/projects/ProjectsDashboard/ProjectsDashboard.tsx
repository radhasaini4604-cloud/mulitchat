import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../../components/ConfirmationModal/ConfirmationModal';
import { ProjectDetail } from '../ProjectDetail/ProjectDetail';
import { getProjects, saveProject, deleteProjectFromDB, getFriendlyDate } from '../../Main_chat/utils/db';
import type { ProjectItem } from '../../Main_chat/utils/db';
import './ProjectsDashboard.css';

interface ProjectsDashboardProps {
  setActiveSessionId: (id: string | null) => void;
  setCurrentView: (view: 'Main_chat' | 'imagine' | 'projects') => void;
}

export function ProjectsDashboard({ setActiveSessionId, setCurrentView }: ProjectsDashboardProps) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      const projs = await getProjects();
      setProjects(projs);
    };
    loadProjects();
  }, []);
  
  // Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Dropdown & Action states
  const [openMenuProjectId, setOpenMenuProjectId] = useState<string | null>(null);
  const [deleteTargetProject, setDeleteTargetProject] = useState<ProjectItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Close menus on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.project-menu-wrapper')) {
        setOpenMenuProjectId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    const newProj: ProjectItem = {
      id: String(Date.now()),
      name: newProjectName.trim(),
      owner: 'me',
      createdAt: Date.now(),
      pinned: false
    };

    saveProject(newProj); // Async save to DB/LocalState
    setProjects([newProj, ...projects]);
    setNewProjectName('');
    setIsModalOpen(false);
  };

  const handleTogglePin = (id: string) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        const nextProj = { ...p, pinned: !p.pinned };
        saveProject(nextProj);
        return nextProj;
      }
      return p;
    });
    setProjects(updated);
    setOpenMenuProjectId(null);
  };

  const handleShareProject = (proj: ProjectItem) => {
    const shareUrl = `${window.location.origin}/projects/${proj.id}`;
    navigator.clipboard.writeText(shareUrl);
    setToastMessage(`Copied share link for "${proj.name}"!`);
    setOpenMenuProjectId(null);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTargetProject) return;
    deleteProjectFromDB(deleteTargetProject.id);
    setProjects(projects.filter(p => p.id !== deleteTargetProject.id));
    setDeleteTargetProject(null);
  };

  // Sort pinned projects to the top
  const sortedProjects = [...projects].sort((a, b) => {
    const aPinned = a.pinned || false;
    const bPinned = b.pinned || false;
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const filteredProjects = sortedProjects.filter(p => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        setActiveSessionId={setActiveSessionId}
        setCurrentView={setCurrentView}
      />
    );
  }

  return (
    <div className="projects-dashboard-container">
      <div className="projects-dashboard-content">
        
        {/* Top Header Row */}
        <header className="projects-header-row">
          <h1 className="projects-title">Projects</h1>
          
          <div className="projects-actions-row">
            {/* Search Input Bar */}
            <div className="search-bar-wrapper">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input 
                type="text"
                placeholder="Search projects"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-projects-input"
              />
            </div>
            
            {/* New Button */}
            <button className="new-btn" onClick={() => setIsModalOpen(true)}>
              New
            </button>
          </div>
        </header>

        {/* Filters Row */}
        <div className="projects-filters-row">
          <button className="filter-tab-btn active">
            Created by you
          </button>
        </div>

        {/* Divider */}
        <div className="projects-divider" />

        {/* Table Column Headers */}
        <div className="projects-table-header">
          <span className="col-header name-col">Name</span>
          <span className="col-header modified-col">Modified</span>
        </div>

        {/* Projects List Rows */}
        <div className="projects-list-rows">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(proj => (
              <div 
                key={proj.id} 
                className="project-row-item"
                onClick={() => setSelectedProject(proj)}
              >
                <div className="project-name-cell">
                  <div className="project-folder-container">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="folder-icon">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <span className="project-row-name">{proj.name}</span>
                  {proj.pinned && (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="pinned-pin-icon">
                      <title>Pinned project</title>
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                    </svg>
                  )}
                </div>
                
                <div className="project-row-right">
                  <span className="project-row-modified">{getFriendlyDate(proj.createdAt)}</span>
                  
                  {/* Hover dropdown wrapper */}
                  <div className="project-menu-wrapper">
                    <button 
                      className={`project-menu-trigger-btn ${openMenuProjectId === proj.id ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuProjectId(openMenuProjectId === proj.id ? null : proj.id);
                      }}
                      title="Project options"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="dots-icon">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </button>
                    
                    {openMenuProjectId === proj.id && (
                      <div className="project-dropdown-menu" onClick={e => e.stopPropagation()}>
                        <button className="dropdown-item" onClick={() => handleTogglePin(proj.id)}>
                          {proj.pinned ? 'Unpin project' : 'Pin project'}
                        </button>
                        <button className="dropdown-item" onClick={() => handleShareProject(proj)}>
                          Share
                        </button>
                        <div className="dropdown-divider" />
                        <button className="dropdown-item delete-item" onClick={() => {
                          setDeleteTargetProject(proj);
                          setOpenMenuProjectId(null);
                        }}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-projects-placeholder">
              No projects found
            </div>
          )}
        </div>

      </div>

      {/* Create Modal Dialog */}
      {isModalOpen && (
        <div className="create-project-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="create-project-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Project</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-proj-name">Project Name</label>
                <input
                  id="modal-proj-name"
                  type="text"
                  placeholder="e.g. nothric"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteTargetProject !== null}
        onClose={() => setDeleteTargetProject(null)}
        type="delete"
        chatTitle={deleteTargetProject?.name}
        title="Delete Project"
        description={deleteTargetProject ? `Are you sure you want to delete "${deleteTargetProject.name}"? This action will permanently remove the project and cannot be undone.` : ''}
        onConfirm={handleDeleteConfirm}
      />

      {/* Share copied Toast Message */}
      {toastMessage && (
        <div className="project-toast-message">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
