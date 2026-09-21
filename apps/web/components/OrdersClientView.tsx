'use client';

import { useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import type { SessionUser } from '../lib/auth';
import {
  fetchStudentOrders,
  type StudentEntitlementsResponse,
  type StudentOrder,
} from '../lib/payments';
const OrderReceiptModal = dynamic(() => import('./OrderReceiptModal'));
const RefundModal = dynamic(() => import('./RefundModal'));

export type OrdersClientViewProps = {
  session: SessionUser;
  token: string | null;
  initialOrders: StudentOrder[];
  initialEntitlements: StudentEntitlementsResponse['entitlements'];
};

export default function OrdersClientView({
  session,
  token,
  initialOrders,
  initialEntitlements,
}: OrdersClientViewProps) {
  const [orders, setOrders] = useState<StudentOrder[]>(initialOrders);
  const [entitlements, setEntitlements] = useState(initialEntitlements);
  const [filter, setFilter] = useState<'all' | 'paid' | 'refunded'>('all');
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Modals state
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<StudentOrder | null>(null);
  const [refundModalOrder, setRefundModalOrder] = useState<StudentOrder | null>(null);

  function handleCopyOrderId(orderId: string) {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(orderId);
      setCopiedOrderId(orderId);
      setTimeout(() => setCopiedOrderId(null), 2000);
    }
  }

  const filteredOrders = orders.filter((o) => {
    if (filter === 'paid') return o.status === 'paid' && !o.refundRequest;
    if (filter === 'refunded') return o.refundRequest || o.status === 'refunded';
    return true;
  });

  const hasFormulaPack = entitlements.some(
    (e) =>
      (e.productKey === 'cbse10-formula-cheatsheet-pack' ||
        e.productKey === 'cbse10-activity-formula-combo') &&
      e.status === 'active',
  );
  const hasActivityPack = entitlements.some(
    (e) =>
      (e.productKey === 'cbse10-activity-diagram-pack' ||
        e.productKey === 'cbse10-activity-formula-combo') &&
      e.status === 'active',
  );
  const hasSciencePack = entitlements.some(
    (e) =>
      (e.productKey === 'cbse10-science-ch1-5-pack' ||
        e.productKey === 'cbse10-mock-pass-science' ||
        e.isAllSubjects) &&
      e.status === 'active',
  );
  const hasMockPass = entitlements.some(
    (e) =>
      (e.productKey === 'cbse10-all-subjects-mock-pack' ||
        e.productKey.startsWith('cbse10-mock-pass-')) &&
      e.status === 'active',
  );

  return (
    <div className="orders-container">
      {/* Page Header */}
      <div className="orders-header">
        <div>
          <p className="eyebrow">Order Management</p>
          <h1>My Purchases &amp; Order History</h1>
          <p className="subtext">
            Access your unlocked formula sheets, activity drills, mock test passes, download tax receipts, and manage transactions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link href="/store" className="primary-header-btn" style={{ background: '#c95014', borderColor: '#c95014' }}>
            🛍️ Visit Store →
          </Link>
          <Link href="/formula-cheatsheets" className="primary-header-btn">
            ⚡ Formula Cheatsheets →
          </Link>
        </div>
      </div>

      {/* Active Entitlement Status Banner */}
      <div className="entitlements-hero-card">
        <div className="entitlement-info">
          <span className="entitlement-badge-icon">
            {entitlements.length > 0 ? '✨' : '🔒'}
          </span>
          <div>
            <h3>
              {entitlements.length > 0
                ? `You Have ${entitlements.filter((e) => e.status === 'active').length} Active Study Pack(s)`
                : 'Free Tier (Paper 1 Unlocked)'}
            </h3>
            <p>
              {entitlements.length > 0
                ? 'Your purchased packs are active with full access across all your devices.'
                : 'Mock Paper 1 is free for all subjects. Upgrade in the store to unlock formula sheets, activity drills, or mock papers.'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {hasFormulaPack && (
            <Link href="/formula-cheatsheets" className="action-pill" style={{ background: '#16a34a', borderColor: '#16a34a' }}>
              ⚡ Open Formula Cheatsheets →
            </Link>
          )}
          {hasActivityPack && (
            <Link href="/activities-and-diagrams" className="action-pill" style={{ background: '#0284c7', borderColor: '#0284c7' }}>
              🔬 Open NCERT Activities →
            </Link>
          )}
          {hasSciencePack && (
            <Link href="/science-pack" className="action-pill" style={{ background: '#c95014', borderColor: '#c95014' }}>
              🧪 Science Ch 1–5 Pack →
            </Link>
          )}
          {hasMockPass && (
            <Link href="/exam-papers" className="action-pill">
              📄 Practice Mock Papers →
            </Link>
          )}
          {entitlements.length === 0 && (
            <Link href="/store" className="action-pill">
              🛍️ Visit Store →
            </Link>
          )}
        </div>
      </div>

      {/* Guarantee Info Strip */}
      <div className="guarantee-strip">
        <span>🛡️ <strong>ChapterReady 48-Hour Guarantee:</strong> 100% automated refund or free subject swap if you are not completely satisfied.</span>
      </div>

      {/* Orders Filter Tabs */}
      <div className="orders-tabs">
        <button
          type="button"
          className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Transactions ({orders.length})
        </button>
        <button
          type="button"
          className={`tab-btn ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          Active Purchases ({orders.filter((o) => o.status === 'paid' && !o.refundRequest).length})
        </button>
        <button
          type="button"
          className={`tab-btn ${filter === 'refunded' ? 'active' : ''}`}
          onClick={() => setFilter('refunded')}
        >
          Refunds &amp; Swaps ({orders.filter((o) => o.refundRequest || o.status === 'refunded').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="empty-orders-card">
          <span className="empty-icon">🧾</span>
          <h3>No orders found</h3>
          <p>
            {filter === 'all'
              ? "You haven't made any purchases yet. All Mock Paper 1s are free to practice right now!"
              : 'No transactions matching this filter.'}
          </p>
          <Link href="/exam-papers" className="primary-header-btn">
            Explore Board Mock Test Series →
          </Link>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => {
            const isAllSubjects = order.productKey === 'cbse10-all-subjects-mock-pack';
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const isActivityPack = order.productKey === 'cbse10-activity-diagram-pack';
            const isFormulaPack = order.productKey === 'cbse10-formula-cheatsheet-pack';
            const isComboPack = order.productKey === 'cbse10-activity-formula-combo';

            const productBadge = isComboPack
              ? '👑 SUPER COMBO PACK'
              : isActivityPack
              ? '🔬 NCERT ACTIVITY PACK'
              : isFormulaPack
              ? '⚡ FORMULA CHEATSHEET PACK'
              : isAllSubjects
              ? '⭐ ALL 4 SUBJECTS PACK'
              : '📚 SINGLE SUBJECT PASS';

            const productTitle = isComboPack
              ? 'Class 10 Activity, Diagram & Formula Super Combo'
              : isActivityPack
              ? 'NCERT Science Activity & Diagram Mastery Pack'
              : isFormulaPack
              ? 'Class 10 Formula & Reaction Cheatsheet Pack'
              : isAllSubjects
              ? 'Class 10 All-Subjects Board Mock Pack (20 Papers)'
              : `Class 10 Mock Pass — ${order.subjectSlug || 'Subject'} (5 Papers)`;

            const launchHref = isActivityPack || isComboPack
              ? '/activities-and-diagrams'
              : isFormulaPack
              ? '/formula-cheatsheets'
              : '/exam-papers';

            const launchLabel = isActivityPack
              ? '🔬 Open Activities'
              : isFormulaPack
              ? '⚡ Open Cheatsheets'
              : isComboPack
              ? '🚀 Open Revision Packs'
              : '🚀 Open Mock Papers';

            return (
              <article className="order-card" key={order.id}>
                {/* Order Topline */}
                <div className="order-topline">
                  <div>
                    <span className="product-badge">{productBadge}</span>
                    <h3 className="order-title">{productTitle}</h3>
                    <p className="order-meta">
                      Purchased on {formattedDate} · Gateway:{' '}
                      <strong>{order.paymentGateway === 'cashfree' ? 'Cashfree Payments' : 'Razorpay'}</strong>
                    </p>
                  </div>

                  <div className="order-price-status">
                    <strong className="order-price">
                      ₹{(order.amount / 100).toFixed(0)}
                    </strong>
                    <span className={`status-tag ${order.status}`}>
                      {order.refundRequest ? `Refund: ${order.refundRequest.status}` : order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="order-divider" />

                {/* Reference IDs & Copy Tool */}
                <div className="order-refs">
                  <div className="ref-item">
                    <span className="ref-label">Order Reference ID:</span>
                    <code className="ref-code">{order.orderId || order.id}</code>
                    <button
                      type="button"
                      onClick={() => handleCopyOrderId(order.orderId || order.id)}
                      className="copy-btn"
                      title="Copy Order ID"
                    >
                      {copiedOrderId === (order.orderId || order.id) ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="ref-item">
                    <span className="ref-label">Receipt No:</span>
                    <code className="ref-code">{order.receipt}</code>
                  </div>
                </div>

                {/* Order Action Buttons */}
                <div className="order-actions">
                  <button
                    type="button"
                    onClick={() => setSelectedReceiptOrder(order)}
                    className="btn-receipt"
                  >
                    📄 View &amp; Print Receipt
                  </button>

                  <Link href={launchHref} className="btn-launch">
                    {launchLabel}
                  </Link>

                  {order.status === 'paid' && !order.refundRequest && (
                    <button
                      type="button"
                      onClick={() => setRefundModalOrder(order)}
                      className="btn-refund"
                    >
                      🛡️ Refund / Swap
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Official Tax Receipt Modal */}
      <OrderReceiptModal
        order={selectedReceiptOrder}
        studentName={session.fullName}
        studentEmail={session.email || undefined}
        isOpen={!!selectedReceiptOrder}
        onClose={() => setSelectedReceiptOrder(null)}
      />

      {/* 48-Hour Refund / Swap Modal */}
      <RefundModal
        isOpen={!!refundModalOrder}
        onClose={() => setRefundModalOrder(null)}
        token={token}
        orders={refundModalOrder ? [refundModalOrder, ...orders.filter((o) => o.id !== refundModalOrder.id)] : orders}
        onRefundCompleted={() => {
          setRefundModalOrder(null);
          // Reload orders
          if (token) {
            fetchStudentOrders(token).then((data) => setOrders(data || []));
          }
        }}
      />

      <style jsx>{`
        .orders-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .orders-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          gap: 1.5rem;
        }

        .eyebrow {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #c25e00;
          margin-bottom: 0.25rem;
        }

        h1 {
          font-size: 2rem;
          font-weight: 800;
          color: #171513;
          letter-spacing: -0.02em;
          margin: 0 0 0.5rem 0;
        }

        .subtext {
          font-size: 1rem;
          color: #5d5750;
          line-height: 1.5;
          margin: 0;
        }

        .primary-header-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          background: #171513;
          color: #ffffff;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.9375rem;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s ease;
        }

        .primary-header-btn:hover {
          background: #c25e00;
        }

        .entitlements-hero-card {
          background: #ffffff;
          border: 1.5px solid #e7e2d6;
          border-radius: 16px;
          padding: 1.5rem 1.75rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
        }

        .entitlement-info {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .entitlement-badge-icon {
          font-size: 2.25rem;
        }

        .entitlement-info h3 {
          font-size: 1.125rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.25rem 0;
        }

        .entitlement-info p {
          font-size: 0.875rem;
          color: #5d5750;
          margin: 0;
          max-width: 600px;
        }

        .action-pill {
          padding: 0.625rem 1.25rem;
          background: #fbf6ec;
          border: 1px solid #eedec4;
          color: #c25e00;
          font-weight: 800;
          font-size: 0.875rem;
          border-radius: 10px;
          text-decoration: none;
          white-space: nowrap;
        }

        .action-pill:hover {
          background: #c25e00;
          color: #ffffff;
        }

        .guarantee-strip {
          background: #eef8f2;
          border: 1px solid #bbf0cf;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-size: 0.875rem;
          color: #14532d;
          margin-bottom: 1.75rem;
        }

        .orders-tabs {
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid #e7e2d6;
          margin-bottom: 1.5rem;
          padding-bottom: 0.5rem;
        }

        .tab-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: none;
          font-size: 0.875rem;
          font-weight: 700;
          color: #797167;
          border-radius: 8px;
          cursor: pointer;
        }

        .tab-btn.active {
          background: #171513;
          color: #ffffff;
        }

        .orders-grid {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .order-card {
          background: #ffffff;
          border: 1px solid #e7e2d6;
          border-radius: 16px;
          padding: 1.5rem 1.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }

        .order-topline {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
        }

        .product-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: #c25e00;
          background: #fff4ea;
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          display: inline-block;
          margin-bottom: 0.35rem;
        }

        .order-title {
          font-size: 1.125rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.25rem 0;
        }

        .order-meta {
          font-size: 0.8125rem;
          color: #797167;
          margin: 0;
        }

        .order-price-status {
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.35rem;
        }

        .order-price {
          font-size: 1.35rem;
          font-weight: 900;
          color: #171513;
        }

        .status-tag {
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 0.25rem 0.625rem;
          border-radius: 20px;
        }

        .status-tag.paid {
          background: #e6f7ec;
          color: #1b873f;
        }

        .status-tag.refunded {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-tag.created {
          background: #fef3c7;
          color: #92400e;
        }

        .order-divider {
          height: 1px;
          background: #f0ecdf;
          margin: 1.25rem 0;
        }

        .order-refs {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          background: #fbf8f3;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          margin-bottom: 1.25rem;
        }

        .ref-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
        }

        .ref-label {
          color: #797167;
          font-weight: 600;
        }

        .ref-code {
          font-family: monospace;
          font-weight: 700;
          color: #171513;
        }

        .copy-btn {
          padding: 0.2rem 0.5rem;
          border: 1px solid #dcd6c8;
          background: #ffffff;
          border-radius: 6px;
          font-size: 0.6875rem;
          font-weight: 700;
          cursor: pointer;
        }

        .copy-btn:hover {
          background: #f4f0e6;
        }

        .order-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-receipt {
          padding: 0.625rem 1rem;
          background: #ffffff;
          border: 1.5px solid #171513;
          color: #171513;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .btn-receipt:hover {
          background: #f4f0e6;
        }

        .btn-launch {
          padding: 0.625rem 1.25rem;
          background: #171513;
          color: #ffffff;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.875rem;
          text-decoration: none;
        }

        .btn-launch:hover {
          background: #c25e00;
        }

        .btn-refund {
          padding: 0.625rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
          margin-left: auto;
        }

        .btn-refund:hover {
          background: #fee2e2;
        }

        .empty-orders-card {
          background: #ffffff;
          border: 1px dashed #dcd6c8;
          border-radius: 16px;
          padding: 3.5rem 2rem;
          text-align: center;
        }

        .empty-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 1rem;
        }

        .empty-orders-card h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #171513;
          margin: 0 0 0.5rem 0;
        }

        .empty-orders-card p {
          font-size: 0.9375rem;
          color: #5d5750;
          max-width: 480px;
          margin: 0 auto 1.5rem auto;
        }
      `}</style>
    </div>
  );
}
