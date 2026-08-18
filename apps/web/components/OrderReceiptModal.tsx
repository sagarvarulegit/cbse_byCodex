'use client';

import type { StudentOrder } from '../lib/payments';

export type OrderReceiptModalProps = {
  order: StudentOrder | null;
  studentName: string;
  studentEmail?: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function OrderReceiptModal({
  order,
  studentName,
  studentEmail,
  isOpen,
  onClose,
}: OrderReceiptModalProps) {
  if (!isOpen || !order) return null;

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isAllSubjects = order.productKey === 'cbse10-all-subjects-mock-pack';
  const productTitle = isAllSubjects
    ? 'Class 10 All-Subjects Board Mock Pack (20 Full-Length Papers)'
    : `Class 10 Mock Pass — ${order.subjectSlug || 'Single Subject'} (5 Papers)`;

  function handlePrint() {
    window.print();
  }

  return (
    <div className="receipt-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="receipt-modal" onClick={(e) => e.stopPropagation()}>
        {/* Printable Receipt Container */}
        <div className="receipt-sheet" id="printable-receipt">
          {/* Header */}
          <div className="receipt-header">
            <div>
              <h2 className="receipt-brand">ChapterReady</h2>
              <p className="receipt-brand-tag">CBSE Class 10 Learning Platform</p>
            </div>
            <div className="receipt-badge-status">
              <span className={`status-pill ${order.status}`}>{order.status.toUpperCase()}</span>
            </div>
          </div>

          <div className="receipt-divider" />

          {/* Metadata Grid */}
          <div className="receipt-info-grid">
            <div>
              <p className="info-label">Billed To</p>
              <strong className="info-val">{studentName}</strong>
              <p className="info-sub">{studentEmail || 'Registered Student'}</p>
              <p className="info-sub">Class 10 CBSE Board Pilot</p>
            </div>
            <div className="text-right">
              <p className="info-label">Receipt / Invoice No.</p>
              <strong className="info-val">{order.receipt}</strong>
              <p className="info-sub">Date: {formattedDate}</p>
              <p className="info-sub">Gateway: {order.paymentGateway === 'cashfree' ? 'Cashfree Payments' : 'Razorpay'}</p>
            </div>
          </div>

          <div className="receipt-ref-box">
            <span><strong>Order ID:</strong> {order.orderId || order.id}</span>
            {order.paymentId ? <span><strong>Payment Ref:</strong> {order.paymentId}</span> : null}
          </div>

          {/* Line Items Table */}
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{productTitle}</strong>
                  <p className="item-desc">
                    Includes full 80-mark board papers, CBT timed exam mode, official marking scheme, and diagnostic reports.
                  </p>
                </td>
                <td className="text-center">1</td>
                <td className="text-right">₹{(order.amount / 100).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          {/* Summary Box */}
          <div className="receipt-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>₹{(order.amount / 100).toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>GST / Taxes:</span>
              <span>₹0.00 (Inclusive)</span>
            </div>
            <div className="total-row grand-total">
              <span>Total Paid:</span>
              <strong>₹{(order.amount / 100).toFixed(2)} {order.currency}</strong>
            </div>
          </div>

          <div className="receipt-footer-note">
            <p>🔒 100% Secure Payment processed via Cashfree Payments.</p>
            <p>Protected by ChapterReady 48-Hour Satisfaction Guarantee. Support: support@chapterready.in</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="receipt-actions no-print">
          <button type="button" onClick={handlePrint} className="print-btn">
            🖨️ Print / Save PDF
          </button>
          <button type="button" onClick={onClose} className="close-btn">
            Close
          </button>
        </div>
      </div>

      <style jsx>{`
        .receipt-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(18, 16, 14, 0.75);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 1.5rem;
        }

        .receipt-modal {
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 580px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(23, 21, 19, 0.1);
          padding: 2rem;
        }

        .receipt-sheet {
          background: #ffffff;
        }

        .receipt-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .receipt-brand {
          font-size: 1.5rem;
          font-weight: 800;
          color: #171513;
          margin: 0;
        }

        .receipt-brand-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #c25e00;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0.25rem 0 0 0;
        }

        .status-pill {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.05em;
        }

        .status-pill.paid {
          background: #e6f7ec;
          color: #1b873f;
        }

        .status-pill.refunded {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-pill.created {
          background: #fef3c7;
          color: #92400e;
        }

        .receipt-divider {
          height: 1.5px;
          background: #e8e3d5;
          margin: 1.25rem 0;
        }

        .receipt-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.25rem;
        }

        .info-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: #797167;
          text-transform: uppercase;
          margin: 0 0 0.25rem 0;
        }

        .info-val {
          font-size: 0.9375rem;
          color: #171513;
        }

        .info-sub {
          font-size: 0.8125rem;
          color: #5d5750;
          margin: 0.15rem 0 0 0;
        }

        .text-right {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        .receipt-ref-box {
          background: #f8f6f0;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.8125rem;
          color: #5d5750;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1.5rem;
          font-family: monospace;
        }

        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
        }

        .receipt-table th {
          background: #f8f6f0;
          padding: 0.625rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #797167;
          text-transform: uppercase;
          border-bottom: 1px solid #e8e3d5;
        }

        .receipt-table td {
          padding: 0.875rem 0.75rem;
          font-size: 0.875rem;
          color: #171513;
          border-bottom: 1px solid #f0ecdf;
        }

        .item-desc {
          font-size: 0.75rem;
          color: #797167;
          margin: 0.25rem 0 0 0;
          line-height: 1.4;
        }

        .receipt-totals {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-left: auto;
          max-width: 260px;
          margin-bottom: 1.5rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
          color: #5d5750;
        }

        .grand-total {
          font-size: 1rem;
          font-weight: 800;
          color: #171513;
          padding-top: 0.5rem;
          border-top: 1.5px solid #171513;
        }

        .receipt-footer-note {
          text-align: center;
          padding-top: 1rem;
          border-top: 1px dashed #e8e3d5;
          font-size: 0.75rem;
          color: #8c8276;
          line-height: 1.5;
        }

        .receipt-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .print-btn {
          flex: 1;
          padding: 0.75rem;
          background: #171513;
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .print-btn:hover {
          background: #c25e00;
        }

        .close-btn {
          padding: 0.75rem 1.5rem;
          background: #f0ecdf;
          color: #171513;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .close-btn:hover {
          background: #e4decb;
        }

        @media print {
          .no-print {
            display: none !important;
          }
          .receipt-overlay {
            position: static;
            background: none;
            padding: 0;
          }
          .receipt-modal {
            box-shadow: none;
            border: none;
            padding: 0;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
