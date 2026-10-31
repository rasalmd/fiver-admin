import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Eye,
  DollarSign,
  ShieldAlert,
  Search,
  ExternalLink,
  Lock,
  Unlock,
} from 'lucide-react';

export default function ProjectsView({
  projects = [],
  onReleaseEscrow,
  onRefundClient,
  loading = false,
}) {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState('');

  const normalizeStatus = (s) => {
    if (s === 'revision_requested') return 'in_revision';
    if (s === 'submitted') return 'delivered';
    return s || 'in_progress';
  };

  const filtered = projects.filter((p) => {
    const s = normalizeStatus(p.status);
    if (filter !== 'all' && s !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.order_number?.toLowerCase().includes(q) ||
        p.reference?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        p.client?.name?.toLowerCase().includes(q) ||
        p.freelancer?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (rawStatus) => {
    const status = normalizeStatus(rawStatus);
    switch (status) {
      case 'completed':
        return <span className="badge badge-approved">Completed</span>;
      case 'in_revision':
        return <span className="badge badge-revision">In Revision</span>;
      case 'delivered':
        return <span className="badge" style={{ background: '#ecfdf5', color: '#047857', border: '1px solid rgba(4,120,87,0.2)' }}>Delivered</span>;
      case 'disputed':
        return <span className="badge badge-rejected">Disputed</span>;
      case 'cancelled':
        return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Cancelled</span>;
      case 'in_progress':
      default:
        return <span className="badge badge-pending">In Progress</span>;
    }
  };

  const fmtCurrency = (val) => {
    const n = Number(val);
    if (isNaN(n) || n <= 0) return '₹4,500';
    return '₹' + n.toLocaleString('en-IN');
  };

  return (
    <div>
      {/* Top Filter & Search */}
      <div className="filterBar">
        <div className="tabGroup">
          <button
            onClick={() => setFilter('all')}
            className={`tabBtn ${filter === 'all' ? 'active' : ''}`}
          >
            All Orders ({projects.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`tabBtn ${filter === 'in_progress' ? 'active' : ''}`}
          >
            In Progress ({projects.filter((p) => normalizeStatus(p.status) === 'in_progress').length})
          </button>
          <button
            onClick={() => setFilter('in_revision')}
            className={`tabBtn ${filter === 'in_revision' ? 'active' : ''}`}
          >
            In Revision ({projects.filter((p) => normalizeStatus(p.status) === 'in_revision').length})
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`tabBtn ${filter === 'delivered' ? 'active' : ''}`}
          >
            Delivered ({projects.filter((p) => normalizeStatus(p.status) === 'delivered').length})
          </button>
          <button
            onClick={() => setFilter('disputed')}
            className={`tabBtn ${filter === 'disputed' ? 'active' : ''}`}
          >
            Disputes ({projects.filter((p) => normalizeStatus(p.status) === 'disputed').length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
          <input
            type="text"
            placeholder="Search order ref, client, or gig..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Order Ref & Title</th>
              <th>Client</th>
              <th>Freelancer</th>
              <th>Escrow Amount</th>
              <th>Revisions</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--iv-text-muted)' }}>
                  No orders found matching the filter.
                </td>
              </tr>
            ) : (
              filtered.map((proj) => {
                const amountVal = proj.gross_amount ?? proj.amount ?? 4500;
                const revUsed = proj.revisions_used ?? proj.revision_count ?? 0;
                const revLimit = proj.revisions_allowed ?? proj.revision_limit ?? 3;

                return (
                  <tr key={proj.id}>
                    <td>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--iv-primary)', fontSize: '0.82rem' }}>
                            {proj.order_number || proj.reference || `PRJ-ORD-${proj.id}`}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--iv-text-light)' }}>
                            Due {proj.due_date || 'In 3 days'}
                          </span>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--iv-text-main)', marginTop: '2px', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {proj.title}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{proj.client?.name || 'Verified Client'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>{proj.client?.company || proj.client?.email || 'Corporate Client'}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{proj.freelancer?.name || 'Alex Vance'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>{proj.freelancer?.job || 'Designer'}</div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--iv-text-main)' }}>
                        {fmtCurrency(amountVal)}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--status-approved)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Lock size={10} /> Escrow Protected
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`badge ${revUsed > 1 ? 'badge-revision' : 'badge'}`} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: 'var(--iv-text-main)' }}>
                          <RotateCcw size={11} /> {revUsed} / {revLimit} Used
                        </span>
                      </div>
                    </td>

                    <td>{getStatusBadge(proj.status)}</td>

                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedProject(proj)}
                        className="btn btnSecondary btnSm"
                      >
                        <Eye size={13} /> Oversee
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Escrow Overseer Modal */}
      {selectedProject && (
        <div className="modalOverlay" onClick={() => setSelectedProject(null)}>
          <div className="modalBox" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span className="badge badge-primary">
                  {selectedProject.order_number || selectedProject.reference || `PRJ-ORD-${selectedProject.id}`}
                </span>
                <h3 className="modalTitle" style={{ marginTop: '4px' }}>{selectedProject.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="btn btnSecondary btnSm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Financial Snapshot */}
              {(() => {
                const totalAmount = Number(selectedProject.gross_amount ?? selectedProject.amount ?? 4500);
                const platformCut = Number(selectedProject.platform_fee ?? (totalAmount * 0.10));
                const freelancerTake = Number(selectedProject.freelancer_amount ?? (totalAmount - platformCut));

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Total Escrow Pool</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--iv-text-main)' }}>{fmtCurrency(totalAmount)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Platform Commission</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--iv-primary)' }}>{fmtCurrency(platformCut)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Freelancer Net Take-Home</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669' }}>{fmtCurrency(freelancerTake)}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Revision History Tracker */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--iv-text-main)' }}>
                  Client Revisions Progress
                </h4>
                {(() => {
                  const used = Number(selectedProject.revisions_used ?? selectedProject.revision_count ?? 0);
                  const allowed = Number(selectedProject.revisions_allowed ?? selectedProject.revision_limit ?? 3);
                  const remaining = Math.max(0, allowed - used);
                  const pct = Math.min(100, (used / allowed) * 100);

                  return (
                    <div style={{ padding: '12px 16px', background: '#ffffff', border: '1px solid var(--iv-border)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px' }}>
                        <span>Cycles Used: {used} of {allowed}</span>
                        <span style={{ color: used >= allowed ? 'var(--status-rejected)' : '#059669' }}>
                          {remaining} Revisions Remaining
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            background: used >= allowed ? 'var(--status-rejected)' : 'var(--iv-primary)',
                            transition: 'width 0.3s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Submitted Deliverables */}
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', color: 'var(--iv-text-main)' }}>
                  Submitted Deliverables & Assets
                </h4>
                <div style={{ padding: '12px 16px', background: '#ffffff', border: '1px solid var(--iv-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                      {selectedProject.deliverable_title || 'Final_Deliverable_Bundle.zip'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>
                      Submitted {selectedProject.delivered_at || 'Recently'}
                    </div>
                  </div>
                  <button className="btn btnSecondary btnSm">
                    <ExternalLink size={13} /> Inspect Assets
                  </button>
                </div>
              </div>

              {/* Administrative Escrow Override Zone */}
              <div style={{ border: '1px dashed #cbd5e1', borderRadius: 'var(--radius-md)', padding: '16px', background: '#fffbeb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <ShieldAlert size={16} color="#d97706" />
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#92400e' }}>
                    Escrow Dispute & Admin Override Zone
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#78350f', marginBottom: '12px' }}>
                  As super administrator, you have the authority to bypass mediation and resolve locked funds directly.
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      onReleaseEscrow(selectedProject.id);
                      setSelectedProject(null);
                    }}
                    className="btn btnSuccess btnSm"
                    disabled={loading}
                  >
                    <Unlock size={14} /> Force Release Funds to Freelancer
                  </button>

                  <button
                    onClick={() => {
                      onRefundClient(selectedProject.id);
                      setSelectedProject(null);
                    }}
                    className="btn btnDanger btnSm"
                    disabled={loading}
                  >
                    <RotateCcw size={14} /> Force Full Refund to Client
                  </button>
                </div>
              </div>
            </div>

            <div className="modalFooter">
              <button onClick={() => setSelectedProject(null)} className="btn btnSecondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
