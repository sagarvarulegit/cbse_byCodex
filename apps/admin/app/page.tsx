const modules = ['Subjects', 'Chapters', 'Topics', 'Lessons', 'Quizzes', 'Publishing Review'];

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <h1>Content Admin</h1>
      <p>Manage the CBSE Class 10 course catalog, videos, notes, and quizzes.</p>
      <section>
        {modules.map((module) => (
          <button key={module} type="button">{module}</button>
        ))}
      </section>
    </main>
  );
}
