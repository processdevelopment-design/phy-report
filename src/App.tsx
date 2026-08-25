import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { TransactionReport } from './pages/TransactionReport';

export default function App() {
  return (
    <ProtectedRoute>
      <TransactionReport />
    </ProtectedRoute>
  );
}
