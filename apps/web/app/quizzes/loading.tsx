import BrandLockup from '../../components/BrandLockup';

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite" className="route-loading-shell">
      <div className="route-loading-topbar">
        <BrandLockup compact />
      </div>
      <section className="route-loading-card">
        <p className="eyebrow">Opening your study page</p>
        <h1>Loading Quiz Arena...</h1>
        <div className="route-loading-bar" />
        <p>Getting the next screen ready.</p>
      </section>
    </main>
  );
}
