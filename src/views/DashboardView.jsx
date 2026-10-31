import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Layers,
  FileCheck2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  CheckCircle,
  Eye,
  Wallet,
} from 'lucide-react';

export default function DashboardView({
  metrics = {},
  dailyRevenue = [],
  services = [],
  portfolios = [],
  withdrawals = [],
  onNavigate,
}) {
  // Format currency helper
  const fmt = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

  const pendingGigs = services.filter((s) => s.status === 'pending_review');
  const pendingPortfolios = portfolios.filter((p) => p.status === 'pending_review');
  const pendingPayouts = withdrawals.filter((w) => w.status === 'pending');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* 4 Hero KPI Cards */}
      <div className="statsGrid">
        <div className="statCard">
          <div>
            <div className="statLabel">Gross Platform GMV</div>
            <div className="statValue">{fmt(metrics.total_gmv || 1485400)}</div>
            <div className="statDelta" style={{ color: '#059669' }}>
              <ArrowUpRight size={14} /> +18.4% this month
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#ecfdf5', color: '#059669' }}>
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="statCard">
          <div>
            <div className="statLabel">Platform Commission (10%)</div>
            <div className="statValue" style={{ color: 'var(--iv-primary)' }}>
              {fmt(metrics.platform_earnings || 148540)}
            </div>
            <div className="statDelta" style={{ color: 'var(--iv-primary)' }}>
              <ArrowUpRight size={14} /> Retained in Escrow & Payouts
            </div>
          </div>
          <div className="statIconBox" style={{ background: 'var(--iv-primary-subtle)', color: 'var(--iv-primary)' }}>
            <DollarSign size={22} />
          </div>
        </div>

        <div className="statCard">
          <div>
            <div className="statLabel">Active Escrow Projects</div>
            <div className="statValue">{metrics.active_projects || 38}</div>
            <div className="statDelta" style={{ color: '#0284c7' }}>
              <span>{metrics.in_revision_count || 5} currently in revision</span>
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <FileCheck2 size={22} />
          </div>
        </div>

        <div className="statCard">
          <div>
            <div className="statLabel">Pending Action Queues</div>
            <div className="statValue" style={{ color: '#d97706' }}>
              {(metrics.pending_services || 8) + (metrics.pending_portfolios || 4) + (metrics.pending_withdrawals || 3)}
            </div>
            <div className="statDelta" style={{ color: '#d97706' }}>
              <Clock size={14} /> Requires Admin Moderation
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#fffbeb', color: '#d97706' }}>
            <AlertCircle size={22} />
          </div>
        </div>
      </div>

      {/* GMV & Commission Analytics Graph + Quick Moderation Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '24px' }}>
        {/* GMV Revenue Chart Card */}
        <div className="card">
          <div className="cardBody">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                  Platform Volume & Commission Velocity
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--iv-text-muted)' }}>
                  Aggregated gross project escrow vs net platform earnings
                </p>
              </div>
              <span className="badge badge-primary">Oct 2026 Live</span>
            </div>

            {/* SVG Interactive Revenue Curve */}
            <div style={{ padding: '16px 0 8px', width: '100%' }}>
              <svg viewBox="0 0 540 180" style={{ width: '100%', height: '170px', overflow: 'visible' }}>
                <defs>
                  <linearGradient id="gmvGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#640014" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="#640014" stopOpacity="0.01" />
                  </linearGradient>
                  <linearGradient id="commGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid horizontal guidelines */}
                <line x1="0" y1="30" x2="540" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="75" x2="540" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="120" x2="540" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="160" x2="540" y2="160" stroke="#e2e8f0" strokeWidth="1" />

                {/* GMV Area */}
                <polygon
                  points="0,160 0,110 90,85 180,98 270,55 360,42 450,20 540,28 540,160"
                  fill="url(#gmvGrad)"
                />
                <polyline
                  points="0,110 90,85 180,98 270,55 360,42 450,20 540,28"
                  fill="none"
                  stroke="#640014"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Commission Area */}
                <polygon
                  points="0,160 0,150 90,146 180,148 270,140 360,138 450,132 540,134 540,160"
                  fill="url(#commGrad)"
                />
                <polyline
                  points="0,150 90,146 180,148 270,140 360,138 450,132 540,134"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                {/* Data Points */}
                {[[0, 110], [90, 85], [180, 98], [270, 55], [360, 42], [450, 20], [540, 28]].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r="4" fill="#ffffff" stroke="#640014" strokeWidth="2.5" />
                ))}

                {/* X Axis Labels */}
                <text x="0" y="176" fontSize="10" fill="#94a3b8" fontWeight="600">Oct 01</text>
                <text x="90" y="176" fontSize="10" fill="#94a3b8" fontWeight="600">Oct 05</text>
                <text x="180" y="176" fontSize="10" fill="#94a3b8" fontWeight="600">Oct 10</text>
                <text x="270" y="176" fontSize="10" fill="#94a3b8" fontWeight="600">Oct 15</text>
                <text x="360" y="176" fontSize="10" fill="#94a3b8" fontWeight="600">Oct 20</text>
                <text x="450" y="176" fontSize="10" fill="#94a3b8" fontWeight="600">Oct 25</text>
                <text x="505" y="176" fontSize="10" fill="#94a3b8" fontWeight="600">Oct 28</text>
              </svg>
            </div>

            <div style={{ display: 'flex', gap: '24px', marginTop: '12px', borderTop: '1px solid var(--iv-border-subtle)', paddingTop: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                <span style={{ width: '12px', height: '12px', background: 'var(--iv-primary)', borderRadius: '2px' }} />
                <span style={{ color: 'var(--iv-text-muted)' }}>Gross Escrow Volume (GMV)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                <span style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '2px' }} />
                <span style={{ color: 'var(--iv-text-muted)' }}>Net 10% Platform Cut</span>
              </div>
            </div>
          </div>
        </div>

        {/* Priority Action Tasks Card */}
        <div className="card">
          <div className="cardBody" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                Actionable Tasks
              </h3>
              <span className="badge badge-pending">Immediate</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
              {/* Task 1: Gigs */}
              <div
                onClick={() => onNavigate('services')}
                style={{
                  padding: '14px',
                  background: '#f8fafc',
                  border: '1px solid var(--iv-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Layers size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Moderate Freelancer Services</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--iv-text-muted)' }}>
                      {pendingGigs.length || 8} submissions awaiting pricing & scope review
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--iv-text-light)" />
              </div>

              {/* Task 2: Payouts */}
              <div
                onClick={() => onNavigate('payouts')}
                style={{
                  padding: '14px',
                  background: '#f8fafc',
                  border: '1px solid var(--iv-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#fdf2f4', color: 'var(--iv-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wallet size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Process Withdrawal Requests</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--iv-text-muted)' }}>
                      {pendingPayouts.length || 3} payouts waiting for bank reference logging
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--iv-text-light)" />
              </div>

              {/* Task 3: Portfolios */}
              <div
                onClick={() => onNavigate('portfolios')}
                style={{
                  padding: '14px',
                  background: '#f8fafc',
                  border: '1px solid var(--iv-border)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Verify Portfolio Media</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--iv-text-muted)' }}>
                      {pendingPortfolios.length || 4} designer showcase works pending check
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--iv-text-light)" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Pending Review Quick Table */}
      <div className="card">
        <div className="cardBody" style={{ paddingBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                Services Pending Moderation Queue
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--iv-text-muted)' }}>
                New gig submissions submitted by freelancers awaiting publishing to marketplace
              </p>
            </div>
            <button onClick={() => onNavigate('services')} className="btn btnSecondary btnSm">
              View All Services ({services.length})
            </button>
          </div>
        </div>

        <div className="tableContainer" style={{ border: 'none', borderRadius: 0 }}>
          <table className="dataTable">
            <thead>
              <tr>
                <th>Service / Gig</th>
                <th>Freelancer</th>
                <th>Category</th>
                <th>Starting Price</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.slice(0, 4).map((service) => (
                <tr key={service.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img
                        src={service.featured_image || '/assets/image/services/default.jpg'}
                        alt={service.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80';
                        }}
                        style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ maxWidth: '340px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--iv-text-main)', fontSize: '0.83rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {service.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>
                          Submitted {service.submitted_at || 'Recently'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{service.freelancer_profile?.user?.name || 'Aiden Cross'}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>
                      {service.freelancer_profile?.level || 'Pro Verified'}
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                      {service.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--iv-text-main)' }}>
                    ₹{service.packages?.[0]?.price?.toLocaleString('en-IN') || '2,499'}
                  </td>
                  <td>
                    <span className={`badge ${service.status === 'active' ? 'badge-approved' : 'badge-pending'}`}>
                      {service.status === 'active' ? 'Approved' : 'Pending Review'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onNavigate('services')}
                      className="btn btnSecondary btnSm"
                      style={{ padding: '4px 10px' }}
                    >
                      <Eye size={13} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
