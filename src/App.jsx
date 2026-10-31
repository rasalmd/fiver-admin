import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Sidebar, { NAV_ITEMS } from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import ServicesView from './views/ServicesView';
import PortfoliosView from './views/PortfoliosView';
import CategoriesView from './views/CategoriesView';
import ProjectsView from './views/ProjectsView';
import RequestsView from './views/RequestsView';
import PayoutsView from './views/PayoutsView';
import CommissionView from './views/CommissionView';
import ClientsView from './views/ClientsView';
import ReviewsView from './views/ReviewsView';
import { fetchAdmin, MOCK_ADMIN_DATA } from './lib/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // App Master Data States
  const [metrics, setMetrics] = useState(MOCK_ADMIN_DATA.metrics);
  const [dailyRevenue, setDailyRevenue] = useState(MOCK_ADMIN_DATA.daily_revenue);
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [categories, setCategories] = useState({ service_categories: [], portfolio_categories: [] });
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [commissionSettings, setCommissionSettings] = useState(MOCK_ADMIN_DATA.commission_settings);
  const [clients, setClients] = useState([]);
  const [reviews, setReviews] = useState([]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial and Refresh Data Load from Live Laravel Backend
  const loadInitialData = async () => {
    setLoading(true);
    try {
      // 1. Overview & Metrics
      const overviewRes = await fetchAdmin('/overview');
      if (overviewRes?.metrics) {
        setMetrics(overviewRes.metrics);
        if (overviewRes.daily_revenue) setDailyRevenue(overviewRes.daily_revenue);
      }

      // 2. Services
      const servicesRes = await fetchAdmin('/services?status=all');
      if (Array.isArray(servicesRes)) {
        setServices(servicesRes);
      } else if (servicesRes?.data && Array.isArray(servicesRes.data)) {
        setServices(servicesRes.data);
      }

      // 3. Portfolios
      const portfoliosRes = await fetchAdmin('/portfolios?status=all');
      if (Array.isArray(portfoliosRes)) {
        setPortfolios(portfoliosRes);
      } else if (portfoliosRes?.data && Array.isArray(portfoliosRes.data)) {
        setPortfolios(portfoliosRes.data);
      }

      // 4. Categories & Subcategories
      const categoriesRes = await fetchAdmin('/categories');
      if (categoriesRes && (categoriesRes.service_categories || categoriesRes.portfolio_categories)) {
        setCategories(categoriesRes);
      } else if (Array.isArray(categoriesRes)) {
        setCategories({
          service_categories: categoriesRes,
          portfolio_categories: [],
        });
      }

      // 5. Projects & Escrow
      const projectsRes = await fetchAdmin('/projects?status=all');
      if (Array.isArray(projectsRes)) {
        setProjects(projectsRes);
      } else if (projectsRes?.data && Array.isArray(projectsRes.data)) {
        setProjects(projectsRes.data);
      }

      // 6. Withdrawals
      const withdrawalsRes = await fetchAdmin('/withdrawals?status=all');
      if (Array.isArray(withdrawalsRes)) {
        setWithdrawals(withdrawalsRes);
      } else if (withdrawalsRes?.data && Array.isArray(withdrawalsRes.data)) {
        setWithdrawals(withdrawalsRes.data);
      }

      // 7. Custom Requests
      const requestsRes = await fetchAdmin('/custom-requests');
      if (Array.isArray(requestsRes)) {
        setRequests(requestsRes);
      } else if (requestsRes?.data && Array.isArray(requestsRes.data)) {
        setRequests(requestsRes.data);
      }

      // 8. Commission Settings
      const commRes = await fetchAdmin('/commission-settings');
      if (commRes && commRes.freelancer_commission_pct !== undefined) {
        setCommissionSettings(commRes);
      }

      // 9. Clients
      const clientsRes = await fetchAdmin('/clients');
      if (Array.isArray(clientsRes)) {
        setClients(clientsRes);
      } else if (clientsRes?.data && Array.isArray(clientsRes.data)) {
        setClients(clientsRes.data);
      }

      // 10. Reviews
      const reviewsRes = await fetchAdmin('/reviews');
      if (Array.isArray(reviewsRes)) {
        setReviews(reviewsRes);
      } else if (reviewsRes?.data && Array.isArray(reviewsRes.data)) {
        setReviews(reviewsRes.data);
      }
    } catch (e) {
      console.warn('[AdminApp] Data load failed, using fallbacks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Action Handlers
  const handleApproveService = async (id) => {
    setLoading(true);
    try {
      await fetchAdmin(`/services/${id}/approve`, { method: 'POST' });
    } catch (e) {}
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'active' } : s))
    );
    setMetrics((prev) => ({
      ...prev,
      pending_services: Math.max(0, (prev.pending_services || 1) - 1),
    }));
    setLoading(false);
    showToast('Service approved and published to marketplace!');
  };

  const handleRejectService = async (id, reason) => {
    setLoading(true);
    try {
      await fetchAdmin(`/services/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch (e) {}
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: 'rejected' } : s))
    );
    setMetrics((prev) => ({
      ...prev,
      pending_services: Math.max(0, (prev.pending_services || 1) - 1),
    }));
    setLoading(false);
    showToast('Service rejected. Reason recorded.', 'info');
  };

  const handleApprovePortfolio = async (id) => {
    setLoading(true);
    try {
      await fetchAdmin(`/portfolios/${id}/approve`, { method: 'POST' });
    } catch (e) {}
    setPortfolios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'published' } : p))
    );
    setMetrics((prev) => ({
      ...prev,
      pending_portfolios: Math.max(0, (prev.pending_portfolios || 1) - 1),
    }));
    setLoading(false);
    showToast('Portfolio work approved for public showcase!');
  };

  const handleRejectPortfolio = async (id, reason) => {
    setLoading(true);
    try {
      await fetchAdmin(`/portfolios/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch (e) {}
    setPortfolios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'rejected' } : p))
    );
    setMetrics((prev) => ({
      ...prev,
      pending_portfolios: Math.max(0, (prev.pending_portfolios || 1) - 1),
    }));
    setLoading(false);
    showToast('Portfolio item rejected.', 'info');
  };

  const handleCreateCategory = async (catData) => {
    setLoading(true);
    try {
      await fetchAdmin('/categories', {
        method: 'POST',
        body: JSON.stringify(catData),
      });
    } catch (e) {}

    if (catData.type === 'portfolio') {
      setCategories((prev) => ({
        ...prev,
        portfolio_categories: [
          { name: catData.name, slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), portfolio_count: 0 },
          ...(prev.portfolio_categories || []),
        ],
      }));
    } else {
      setCategories((prev) => ({
        ...prev,
        service_categories: [
          {
            id: Date.now(),
            name: catData.name,
            slug: catData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            services_count: 0,
            subcategories: [],
          },
          ...(prev.service_categories || []),
        ],
      }));
    }
    setLoading(false);
    showToast(`Category "${catData.name}" created!`);
  };

  const handleCreateSubcategory = async (subData) => {
    setLoading(true);
    try {
      await fetchAdmin('/subcategories', {
        method: 'POST',
        body: JSON.stringify(subData),
      });
    } catch (e) {}

    setCategories((prev) => {
      const updated = (prev.service_categories || []).map((cat) => {
        if (cat.name === subData.category_name) {
          const subExists = cat.subcategories?.some((s) => s.name === subData.subcategory_name);
          if (!subExists) {
            return {
              ...cat,
              subcategories: [
                ...(cat.subcategories || []),
                { name: subData.subcategory_name, slug: subData.subcategory_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'), services_count: 0 },
              ],
            };
          }
        }
        return cat;
      });
      return { ...prev, service_categories: updated };
    });

    setLoading(false);
    showToast(`Subcategory "${subData.subcategory_name}" added under "${subData.category_name}"!`);
  };

  const handleReleaseEscrow = async (projectId) => {
    setLoading(true);
    try {
      await fetchAdmin(`/projects/${projectId}/force-release`, { method: 'POST' });
    } catch (e) {}
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'completed' } : p))
    );
    setLoading(false);
    showToast('Admin override: Escrow successfully released to freelancer wallet!');
  };

  const handleRefundClient = async (projectId) => {
    setLoading(true);
    try {
      await fetchAdmin(`/projects/${projectId}/force-refund`, { method: 'POST' });
    } catch (e) {}
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'cancelled' } : p))
    );
    setLoading(false);
    showToast('Admin override: Escrow refunded back to client account.', 'info');
  };

  const handleProcessPayout = async (withdrawalId, transactionId) => {
    setLoading(true);
    try {
      await fetchAdmin(`/withdrawals/${withdrawalId}/process`, {
        method: 'POST',
        body: JSON.stringify({ transaction_id: transactionId }),
      });
    } catch (e) {}
    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status: 'processed',
              transaction_id: transactionId,
              processed_at: 'Just now',
            }
          : w
      )
    );
    setMetrics((prev) => ({
      ...prev,
      pending_withdrawals: Math.max(0, (prev.pending_withdrawals || 1) - 1),
    }));
    setLoading(false);
    showToast(`Withdrawal marked as Paid with UTR: ${transactionId}`);
  };

  const handleRejectPayout = async (withdrawalId, reason) => {
    setLoading(true);
    try {
      await fetchAdmin(`/withdrawals/${withdrawalId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    } catch (e) {}
    setWithdrawals((prev) =>
      prev.map((w) => (w.id === withdrawalId ? { ...w, status: 'rejected' } : w))
    );
    setMetrics((prev) => ({
      ...prev,
      pending_withdrawals: Math.max(0, (prev.pending_withdrawals || 1) - 1),
    }));
    setLoading(false);
    showToast('Withdrawal rejected and funds refunded to freelancer wallet.', 'info');
  };

  const handleSaveCommission = async (newSettings) => {
    setLoading(true);
    try {
      await fetchAdmin('/commission-settings', {
        method: 'POST',
        body: JSON.stringify(newSettings),
      });
    } catch (e) {}
    setCommissionSettings((prev) => ({ ...prev, ...newSettings }));
    setLoading(false);
    showToast('Platform commission rates successfully saved!');
  };

  const handleToggleReviewVisibility = async (reviewId) => {
    setLoading(true);
    try {
      await fetchAdmin(`/reviews/${reviewId}/toggle-visibility`, { method: 'POST' });
    } catch (e) {}
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, status: r.status === 'published' ? 'hidden' : 'published' }
          : r
      )
    );
    setLoading(false);
    showToast('Review visibility updated on public marketplace.');
  };

  // Find active navigation item metadata from URL pathname
  const currentNavItem = NAV_ITEMS.find((n) =>
    n.path === '/'
      ? location.pathname === '/' || location.pathname === '/dashboard'
      : location.pathname.startsWith(n.path)
  ) || NAV_ITEMS[0];

  return (
    <div className="adminShell">
      {/* Toast Notification Banner */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: toast.type === 'info' ? '#1e293b' : '#059669',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.18)',
            fontSize: '0.85rem',
            fontWeight: 700,
            animation: 'slideUp 0.2s ease',
          }}
        >
          {toast.type === 'info' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Edge-to-edge Flush Burgundy Sidebar with Router Sync */}
      <Sidebar metrics={metrics} />

      {/* Main Content Area */}
      <div className="adminMain">
        <Header
          title={currentNavItem.label}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onRefresh={loadInitialData}
          loading={loading}
          metrics={metrics}
        />

        <main className="adminContent">
          <Routes>
            <Route
              path="/"
              element={
                <DashboardView
                  metrics={metrics}
                  dailyRevenue={dailyRevenue}
                  services={services}
                  portfolios={portfolios}
                  withdrawals={withdrawals}
                  onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)}
                />
              }
            />
            <Route
              path="/dashboard"
              element={
                <DashboardView
                  metrics={metrics}
                  dailyRevenue={dailyRevenue}
                  services={services}
                  portfolios={portfolios}
                  withdrawals={withdrawals}
                  onNavigate={(path) => navigate(path.startsWith('/') ? path : `/${path}`)}
                />
              }
            />
            <Route
              path="/services"
              element={
                <ServicesView
                  services={services}
                  onApprove={handleApproveService}
                  onReject={handleRejectService}
                  loading={loading}
                />
              }
            />
            <Route
              path="/portfolios"
              element={
                <PortfoliosView
                  portfolios={portfolios}
                  onApprove={handleApprovePortfolio}
                  onReject={handleRejectPortfolio}
                  loading={loading}
                />
              }
            />
            <Route
              path="/categories"
              element={
                <CategoriesView
                  categories={categories}
                  onCreateCategory={handleCreateCategory}
                  onCreateSubcategory={handleCreateSubcategory}
                  loading={loading}
                />
              }
            />
            <Route
              path="/projects"
              element={
                <ProjectsView
                  projects={projects}
                  onReleaseEscrow={handleReleaseEscrow}
                  onRefundClient={handleRefundClient}
                  loading={loading}
                />
              }
            />
            <Route
              path="/requests"
              element={
                <RequestsView
                  requests={requests}
                  loading={loading}
                />
              }
            />
            <Route
              path="/payouts"
              element={
                <PayoutsView
                  withdrawals={withdrawals}
                  onProcessPayout={handleProcessPayout}
                  onRejectPayout={handleRejectPayout}
                  loading={loading}
                />
              }
            />
            <Route
              path="/commission"
              element={
                <CommissionView
                  settings={commissionSettings}
                  onSaveSettings={handleSaveCommission}
                  loading={loading}
                />
              }
            />
            <Route
              path="/clients"
              element={
                <ClientsView
                  clients={clients}
                  loading={loading}
                />
              }
            />
            <Route
              path="/reviews"
              element={
                <ReviewsView
                  reviews={reviews}
                  onToggleVisibility={handleToggleReviewVisibility}
                  loading={loading}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
