import BrandLockup from '../../components/BrandLockup';

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite" className="route-loading-shell">
      <div className="route-loading-topbar">
        <BrandLockup compact />
      </div>
      <section className="route-loading-card">
        <p className="eyebrow">Opening your study page</p>
        <h1>Getting today&apos;s plan ready...</h1>
        <div className="route-loading-bar" />
        <p>This will only take a moment.</p>
      </section>
    </main>
  );
}
