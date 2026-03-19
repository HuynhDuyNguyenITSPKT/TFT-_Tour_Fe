import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import DashboardLayout from '../layouts/DashboardLayout';
import { SkeletonCard } from '../components/LoadingSkeleton';
import { useI18n } from '../hooks/useI18n';
import { useToast } from '../hooks/useToast';
import { getTopics } from '../api/topicApi';
import { getErrorMessage } from '../utils/httpError';

export default function HomePage() {
  const { t } = useI18n();
  const toast = useToast();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTopics() {
      setLoading(true);

      try {
        const response = await getTopics();
        setTopics(response.data || []);
      } catch (error) {
        toast.error(getErrorMessage(error, t('home.loadTopicsFailed')));
      } finally {
        setLoading(false);
      }
    }

    loadTopics();
  }, [t, toast]);

  return (
    <DashboardLayout title={t('home.title')} currentPath="/">
      <div class="section-head">
        <div>
          <h3>{t('home.topicList')}</h3>
          <p class="muted">{t('home.topicListDesc')}</p>
        </div>
      </div>

      <div class="card-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index} />)
          : topics.map((topic) => (
              <article key={topic.id} class="project-card">
                <h4>{topic.name}</h4>
                <p>{topic.description}</p>
                <div class="inline-actions">
                  <button class="primary-btn" onClick={() => route(`/topics/${topic.id}`)}>
                    {t('home.viewTopic')}
                  </button>
                </div>
              </article>
            ))}
      </div>

      {!loading && topics.length === 0 ? (
        <div class="empty-state">{t('home.noTopics')}</div>
      ) : null}
    </DashboardLayout>
  );
}
