import { route } from 'preact-router';
import { useEffect, useMemo, useState } from 'preact/hooks';
import DashboardLayout from '../layouts/DashboardLayout';
import Modal from '../components/Modal';
import { useAuth } from '../hooks/useAuth';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { userHasRole } from '../utils/auth';
import { getErrorMessage } from '../utils/httpError';
import { getTopics } from '../api/topicApi';
import {
  createPost,
  deletePost,
  getPostsByTopic,
  updatePost
} from '../api/postApi';

const initialPostForm = { title: '', content: '' };

function toDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function TopicDetailPage({ topicId }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const toast = useToast();

  const [topic, setTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState(initialPostForm);

  const isAdmin = useMemo(() => userHasRole(user, 'ADMIN'), [user]);

  useEffect(() => {
    async function loadPageData() {
      setLoading(true);

      try {
        const [topicsResponse, postsResponse] = await Promise.all([
          getTopics(),
          getPostsByTopic(topicId)
        ]);

        const foundTopic = (topicsResponse.data || []).find(
          (item) => String(item.id) === String(topicId)
        );

        setTopic(foundTopic || null);
        setPosts(postsResponse.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error, t('topicDetail.loadFailed')));
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, [topicId, t, toast]);

  function canManagePost(post) {
    if (isAdmin) return true;

    const ownerId = post.userId ?? post.createdByUserId ?? post.authorId;
    return Boolean(user?.id) && String(ownerId) === String(user.id);
  }

  function openCreateModal() {
    setEditingPost(null);
    setForm(initialPostForm);
    setIsModalOpen(true);
  }

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
      toast.error(t('topicDetail.titleLengthInvalid'));
      return;
    }

    if (content.length < 10 || content.length > 4000) {
      toast.error(t('topicDetail.contentLengthInvalid'));
      return;
    }

    setIsSaving(true);

    try {
      const payload = { title, content };

      if (editingPost?.id) {
        await updatePost(editingPost.id, payload);
        toast.success(t('topicDetail.postUpdated'));
      } else {
        await createPost(topicId, payload);
        toast.success(t('topicDetail.postCreated'));
      }

      const response = await getPostsByTopic(topicId);
      setPosts(response.data || []);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error, t('topicDetail.saveFailed')));
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete(postId) {
    if (!window.confirm(t('topicDetail.confirmDelete'))) return;

    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((post) => post.id !== postId));
      toast.success(t('topicDetail.postDeleted'));
    } catch (error) {
      toast.error(getErrorMessage(error, t('topicDetail.deleteFailed')));
    }
  }

  return (
    <DashboardLayout title={topic?.name || t('topicDetail.title')} currentPath="/">
      <div class="section-head">
        <div>
          <h3>{topic?.name || t('topicDetail.title')}</h3>
          <p class="muted">{topic?.description || t('topicDetail.defaultDescription')}</p>
        </div>
        <div class="inline-actions">
          <button class="ghost-btn" onClick={() => route('/', true)}>
            {t('topicDetail.backToTopics')}
          </button>
          <button class="primary-btn" onClick={openCreateModal}>
            {t('topicDetail.newPost')}
          </button>
        </div>
      </div>

      {loading ? <div class="empty-state">{t('topicDetail.loadingPosts')}</div> : null}

      {!loading && posts.length === 0 ? (
        <div class="empty-state">{t('topicDetail.noPosts')}</div>
      ) : null}

      {!loading && posts.length ? (
        <div class="card-grid">
          {posts.map((post) => (
            <article key={post.id} class="project-card">
              <h4>{post.title}</h4>
              <p>{post.content}</p>
              <p class="muted">
                {t('topicDetail.postMeta', {
                  userName: post.userName || t('topicDetail.unknownUser'),
                  createdAt: toDateTime(post.createdAt)
                })}
              </p>
              {canManagePost(post) ? (
                <div class="inline-actions">
                  <button class="ghost-btn" onClick={() => openEditModal(post)}>
                    {t('topicDetail.edit')}
                  </button>
                  <button class="danger-btn" onClick={() => onDelete(post.id)}>
                    {t('topicDetail.delete')}
                  </button>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : null}

      <Modal
        open={isModalOpen}
        title={editingPost ? t('topicDetail.editPost') : t('topicDetail.createPost')}
        onClose={() => setIsModalOpen(false)}
        footer={
          <>
            <button class="ghost-btn" onClick={() => setIsModalOpen(false)}>
              {t('topicDetail.cancel')}
            </button>
            <button class="primary-btn" onClick={onSubmit} disabled={isSaving}>
              {isSaving ? t('topicDetail.saving') : t('topicDetail.save')}
            </button>
          </>
        }
      >
        <form class="stack-form" onSubmit={onSubmit}>
          <label>
            {t('topicDetail.postTitle')}
            <input
              value={form.title}
              onInput={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              minLength={3}
              maxLength={200}
              required
            />
          </label>

          <label>
            {t('topicDetail.postContent')}
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

