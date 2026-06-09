import { logoutAction } from './auth-actions';
import { requireAdminSession } from '../lib/auth';

const modules = ['Subjects', 'Chapters', 'Topics', 'Lessons', 'Quizzes', 'Publishing Review'];
const metrics = [
  { label: 'Draft lessons', value: '5' },
  { label: 'Published pilot lessons', value: '4' },
  { label: 'Needs review', value: '2' },
];

export default async function AdminPage() {
  const session = await requireAdminSession();

  return (
    <main className="admin-shell">
      <header className="admin-topbar">
        <div>
          <p className="admin-eyebrow">Content admin</p>
          <h1>CBSE publishing workspace</h1>
          <p>Signed in as {session.fullName}. Review content modules, lesson publishing, and the pilot catalog.</p>
        </div>
        <form action={logoutAction}>
          <button type="submit">Logout</button>
        </form>
      </header>

      <section className="admin-metric-grid">
        {metrics.map((metric) => (
          <article className="admin-metric-card" key={metric.label}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-module-grid">
        {modules.map((module) => (
          <button key={module} type="button">
            {module}
          </button>
        ))}
      </section>
    </main>
  );
}
