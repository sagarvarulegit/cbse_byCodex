import { redirect } from 'next/navigation';

import OrdersClientView from '../../components/OrdersClientView';
import StudentTopbar from '../../components/StudentTopbar';
import {
  getStudentSession,
  getStudentSessionToken,
} from '../../lib/auth';
import {
  fetchStudentEntitlements,
  fetchStudentOrders,
} from '../../lib/payments';

export default async function OrdersPage() {
  const [session, token] = await Promise.all([
    getStudentSession(),
    getStudentSessionToken(),
  ]);

  if (!session || !token) {
    redirect('/login?redirect=/orders');
  }

  const [orders, entitlements] = await Promise.all([
    fetchStudentOrders(token),
    fetchStudentEntitlements(token),
  ]);

  return (
    <main style={{ minHeight: '100vh', background: '#fbf8f3', paddingBottom: '4rem' }}>
      <StudentTopbar
        contextLabel="Purchases & Orders"
        session={session}
      />
      <OrdersClientView
        session={session}
        token={token}
        initialOrders={orders || []}
        initialEntitlements={entitlements?.entitlements || []}
      />
    </main>
  );
}
