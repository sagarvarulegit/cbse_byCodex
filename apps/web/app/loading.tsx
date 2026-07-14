export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite" className="route-loading-shell">
      <div className="route-loading-topbar">
        <span className="brand-mark">10</span>
        <strong>CBSE Sprint</strong>
      </div>
      <section className="route-loading-card">
        <p className="eyebrow">Opening your study page</p>
        <h1>Loading...</h1>
        <div className="route-loading-bar" />
        <p>Getting the next screen ready.</p>
      </section>
    </main>
  );
}
