import { useEffect, useState } from 'preact/hooks';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { useToast } from '../hooks/useToast';
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject
} from '../api/projectApi';
import { getErrorMessage } from '../utils/httpError';

const initialForm = { name: '', description: '' };

export default function ProjectsPage() {
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(initialForm);

  async function loadProjects() {
    setLoading(true);

    try {
      const response = await getProjects();
      setProjects(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Khong the tai danh sach project.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openCreateModal() {
    setEditingProject(null);
    setForm(initialForm);
    setIsModalOpen(true);
  }

  function openEditModal(project) {
    setEditingProject(project);
    setForm({
      name: project.name || '',
      description: project.description || ''
    });
    setIsModalOpen(true);
  }

  async function onSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    try {
      if (editingProject?.id) {
        await updateProject(editingProject.id, form);
        toast.success('Cap nhat project thanh cong.');
      } else {
        await createProject(form);
        toast.success('Tao project thanh cong.');
      }

      setIsModalOpen(false);
      await loadProjects();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Khong the luu project.'));
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete(projectId) {
    const ok = window.confirm('Ban co chac chan muon xoa project nay?');
    if (!ok) return;

    try {
      await deleteProject(projectId);
      toast.success('Da xoa project.');
      setProjects((prev) => prev.filter((project) => project.id !== projectId));
    } catch (error) {
      toast.error(getErrorMessage(error, 'Khong the xoa project.'));
    }
  }

  return (
    <DashboardLayout title="Projects" currentPath="/projects">
      <div class="section-head">
        <div>
          <h3>Your Projects</h3>
          <p class="muted">Quan ly project dang thuoc current user</p>
        </div>
        <button class="primary-btn" onClick={openCreateModal}>
          + New project
        </button>
      </div>

      <div class="card-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : projects.map((project) => (
              <article key={project.id} class="project-card">
                <h4>{project.name}</h4>
                <p>{project.description || 'No description'}</p>
                <div class="inline-actions">
                  <button class="ghost-btn" onClick={() => openEditModal(project)}>
                    Update
                  </button>
                  <button class="danger-btn" onClick={() => onDelete(project.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
      </div>

      {!loading && projects.length === 0 ? (
        <div class="empty-state">Chua co project nao. Hay tao project dau tien.</div>
      ) : null}

      <Modal
        open={isModalOpen}
        title={editingProject ? 'Update project' : 'Create project'}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button class="ghost-btn" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button class="primary-btn" onClick={onSubmit} disabled={isSaving}>
              {isSaving ? 'Saving...' : editingProject ? 'Update' : 'Create'}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmit}>
          <label>
            Name
            <input
              value={form.name}
              onInput={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
          </label>

          <label>
            Description
            <textarea
              rows={4}
              value={form.description}
              onInput={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </label>
        </form>
      </Modal>
    </DashboardLayout>
  );
}
