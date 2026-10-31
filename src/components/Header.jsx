import React, { useState } from 'react';
import {
  Search,
  Bell,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Command,
} from 'lucide-react';

export default function Header({
  title,
  subtitle,
  searchQuery,
  setSearchQuery,
  onRefresh,
  loading = false,
  metrics = {},
}) {
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingTotal =
    (metrics.pending_services || 0) +
    (metrics.pending_portfolios || 0) +
    (metrics.pending_withdrawals || 0);

  return (
    <header className="adminHeader">
      {/* Title & Breadcrumbs */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--iv-text-light)', fontWeight: 600 }}>
            ADMIN PORTAL
          </span>
          <span style={{ color: 'var(--iv-border)', fontSize: '0.8rem' }}>/</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--iv-primary)', fontWeight: 700 }}>
            {title}
          </span>
        </div>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--iv-text-main)', letterSpacing: '-0.02em', marginTop: '2px' }}>
          {title}
        </h1>
      </div>

      {/* Center Search Input */}
      <div className="headerSearch">
        <Search size={16} className="headerSearchIcon" />
        <input
          type="text"
          placeholder="Search gigs, freelancers, orders, clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="headerSearchInput"
        />
        <div className="searchShortcut">
          <Command size={11} /> K
        </div>
      </div>

      {/* Right Tools: Status, Refresh, Notifications, Profile */}
      <div className="headerActions">
        {/* Backend Connected Pill */}
        <div className="statusIndicatorPill">
          <div className="pulseDot" />
          <span>Laravel API Active</span>
        </div>

        {/* Refresh Action */}
        <button
          onClick={onRefresh}
          className="btn btn-secondary iconBtn"
          title="Refresh Data"
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'spin' : ''} />
        </button>

        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="btn btn-secondary iconBtn"
            style={{ position: 'relative' }}
            title="Notifications"
          >
            <Bell size={16} />
            {pendingTotal > 0 && (
              <span className="notifBadge">{pendingTotal}</span>
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="notificationsDropdown">
              <div className="notifHeader">
                <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Action Items Required</span>
                <span className="badge badge-primary">{pendingTotal} Tasks</span>
              </div>
              <div className="notifList">
                {metrics.pending_services > 0 && (
                  <div className="notifItem">
                    <Clock size={16} color="var(--status-pending)" />
                    <div>
                      <div className="notifTitle">Gigs Awaiting Approval</div>
                      <div className="notifDesc">{metrics.pending_services} new service submissions require review</div>
                    </div>
                  </div>
                )}
                {metrics.pending_withdrawals > 0 && (
                  <div className="notifItem">
                    <AlertTriangle size={16} color="var(--status-rejected)" />
                    <div>
                      <div className="notifTitle">Pending Payout Requests</div>
                      <div className="notifDesc">{metrics.pending_withdrawals} withdrawal batches need bank verification</div>
                    </div>
                  </div>
                )}
                {metrics.pending_portfolios > 0 && (
                  <div className="notifItem">
                    <CheckCircle size={16} color="var(--status-approved)" />
                    <div>
                      <div className="notifTitle">Portfolio Submissions</div>
                      <div className="notifDesc">{metrics.pending_portfolios} creative media showcases pending check</div>
                    </div>
                  </div>
                )}
                {pendingTotal === 0 && (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--iv-text-muted)', fontSize: '0.85rem' }}>
                    <Sparkles size={24} color="var(--iv-primary)" style={{ margin: '0 auto 8px' }} />
                    All queues are clear! Everything is reviewed.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
