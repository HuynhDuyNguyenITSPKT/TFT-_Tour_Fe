import { useEffect, useState } from 'preact/hooks';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { getErrorMessage } from '../utils/httpError';
import {
  deletePost,
  getMyPosts,
  updatePost
} from '../api/postApi';

const initialForm = { title: '', content: '' };

function toDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function MyPostsPage() {
  const { t } = useI18n();
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState(initialForm);

  async function loadPosts() {
    setLoading(true);

    try {
      const response = await getMyPosts();
      setPosts(response.data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, t('myPosts.loadFailed')));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function openEditModal(post) {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      content: post.content || ''
    });
    setIsModalOpen(true);
  }

  async function onSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const content = form.content.trim();

    if (title.length < 3 || title.length > 200) {
      toast.error(t('myPosts.titleLengthInvalid'));
      return;
    }

    if (content.length < 10 || content.length > 4000) {
      toast.error(t('myPosts.contentLengthInvalid'));
      return;
    }

    setIsSaving(true);

    try {
      await updatePost(editingPost.id, { title, content });
      toast.success(t('myPosts.postUpdated'));
      setIsModalOpen(false);
      await loadPosts();
    } catch (error) {
      toast.error(getErrorMessage(error, t('myPosts.updateFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete(postId) {
    if (!window.confirm(t('myPosts.confirmDelete'))) return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success(t('myPosts.postDeleted'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('myPosts.deleteFailed')));
    }
  }

  return (
    <DashboardLayout title={t('myPosts.title')} currentPath="/posts/me">
      <div class="section-head">
        <div>
          <h3>{t('myPosts.heading')}</h3>
          <p class="muted">{t('myPosts.description')}</p>
        </div>
      </div>

      {loading ? <div class="empty-state">{t('myPosts.loading')}</div> : null}

      {!loading && posts.length === 0 ? (
        <div class="empty-state">{t('myPosts.noPosts')}</div>
      ) : null}

      {!loading && posts.length ? (
        <div class="card-grid">
          {posts.map((post) => (
            <article key={post.id} class="project-card">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <p class="muted">{t('myPosts.createdAt', { date: toDateTime(post.createdAt) })}</p>
              <div class="inline-actions">
                <button class="ghost-btn" onClick={() => openEditModal(post)}>
                  {t('myPosts.edit')}
                </button>
                <button class="danger-btn" onClick={() => onDelete(post.id)}>
                  {t('myPosts.delete')}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <Modal
        open={isModalOpen}
        title={t('myPosts.editPost')}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button class="ghost-btn" onClick={() => setIsModalOpen(false)}>
              {t('myPosts.cancel')}
            </button>
            <button class="primary-btn" onClick={onSubmit} disabled={isSaving}>
              {isSaving ? t('myPosts.saving') : t('myPosts.save')}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmit}>
          <label>
            {t('myPosts.postTitle')}
            <input
              value={form.title}
              onInput={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              minLength={3}
              maxLength={200}
              required
            />
          </label>

          <label>
            {t('myPosts.postContent')}
            <textarea
              rows={6}
              value={form.content}
              onInput={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
              minLength={10}
              maxLength={4000}
              required
            />
          </label>
        </form>
      </Modal>
    </DashboardLayout>
  );
}

