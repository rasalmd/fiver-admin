import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  Image as ImageIcon,
  Tags,
  FileCheck2,
  Send,
  Wallet,
  Percent,
  Users,
  Star,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', path: '/', label: 'Dashboard', icon: LayoutDashboard, badgeKey: null },
  { id: 'services', path: '/services', label: 'Services (Gigs)', icon: Layers, badgeKey: 'pending_services' },
  { id: 'portfolios', path: '/portfolios', label: 'Portfolio Queue', icon: ImageIcon, badgeKey: 'pending_portfolios' },
  { id: 'categories', path: '/categories', label: 'Categories & Taxonomy', icon: Tags, badgeKey: null },
  { id: 'projects', path: '/projects', label: 'Projects & Escrow', icon: FileCheck2, badgeKey: 'active_projects' },
  { id: 'requests', path: '/requests', label: 'Custom Requests', icon: Send, badgeKey: null },
  { id: 'payouts', path: '/payouts', label: 'Earnings & Payouts', icon: Wallet, badgeKey: 'pending_withdrawals' },
  { id: 'commission', path: '/commission', label: 'Platform Commission', icon: Percent, badgeKey: null },
  { id: 'clients', path: '/clients', label: 'Client Intelligence', icon: Users, badgeKey: null },
  { id: 'reviews', path: '/reviews', label: 'Reviews & Feedback', icon: Star, badgeKey: null },
];

export default function Sidebar({ metrics = {} }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isCurrentActive = (item) => {
    if (item.path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="adminSidebar">
      {/* Brand Header */}
      <div className="sidebarBrand">
        <div className="brandBadge" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="brandLogo">IV</div>
          <div>
            <div className="brandName">IlluVision</div>
            <div className="brandSub">Freelancer Admin</div>
          </div>
        </div>
        <span className="badge badge-primary" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>
          MASTER
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="sidebarNav">
        <div className="sidebarSectionLabel">CORE MANAGEMENT</div>
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = isCurrentActive(item);
          const badgeCount = item.badgeKey ? metrics[item.badgeKey] : null;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`sidebarLink ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} className="sidebarIcon" />
                <span>{item.label}</span>
              </div>
              {badgeCount > 0 && (
                <span className={`badge ${item.badgeKey?.includes('pending') ? 'badge-pending' : 'badge-primary'}`}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}

        <div className="sidebarSectionLabel" style={{ marginTop: '16px' }}>FINANCE & OPERATIONS</div>
        {NAV_ITEMS.slice(5).map((item) => {
          const Icon = item.icon;
          const isActive = isCurrentActive(item);
          const badgeCount = item.badgeKey ? metrics[item.badgeKey] : null;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`sidebarLink ${isActive ? 'active' : ''}`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={18} className="sidebarIcon" />
                <span>{item.label}</span>
              </div>
              {badgeCount > 0 && (
                <span className={`badge ${item.badgeKey?.includes('pending') ? 'badge-pending' : 'badge-primary'}`}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer with system link & admin badge */}
      <div className="sidebarFooter">
        <a
          href="http://localhost:3000/service"
          target="_blank"
          rel="noreferrer"
          className="sidebarLink"
          style={{ padding: '8px 10px', fontSize: '0.8rem', color: 'var(--iv-text-muted)' }}
        >
          <ExternalLink size={15} />
          <span>Live Client App</span>
          <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
        </a>

        <div className="adminUserCard">
          <div className="adminAvatar">AD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--iv-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Super Admin
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>
              admin@illuvision.io
            </div>
          </div>
          <ShieldCheck size={16} color="var(--iv-primary)" />
        </div>
      </div>
    </aside>
  );
}
