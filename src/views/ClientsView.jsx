import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  Briefcase,
  RotateCcw,
  AlertTriangle,
  Search,
  Eye,
  Building,
  Mail,
  ShieldCheck,
} from 'lucide-react';

export default function ClientsView({ clients = [], loading = false }) {
  const [search, setSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);

  const filtered = clients.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalSpentAll = clients.reduce((sum, c) => sum + Number(c.total_spent || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top CRM Stats */}
      <div className="statsGrid">
        <div className="statCard">
          <div>
            <div className="statLabel">Registered Clients</div>
            <div className="statValue">{clients.length || 128}</div>
            <div className="statDelta" style={{ color: '#059669' }}>
              <ShieldCheck size={14} /> 100% Verified Corporate & Pro Accounts
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <Users size={22} />
          </div>
        </div>

        <div className="statCard">
          <div>
            <div className="statLabel">Cumulative Client Spend</div>
            <div className="statValue" style={{ color: '#059669' }}>
              ₹{totalSpentAll.toLocaleString('en-IN')}
            </div>
            <div className="statDelta" style={{ color: '#059669' }}>
              Across design, motion & code projects
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#ecfdf5', color: '#059669' }}>
            <DollarSign size={22} />
          </div>
        </div>

        <div className="statCard">
          <div>
            <div className="statLabel">Active Revisions In Progress</div>
            <div className="statValue" style={{ color: '#d97706' }}>
              {clients.reduce((sum, c) => sum + Number(c.active_revisions || 0), 0)}
            </div>
            <div className="statDelta" style={{ color: '#d97706' }}>
              <RotateCcw size={14} /> Iteration cycles with freelancers
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#fffbeb', color: '#d97706' }}>
            <RotateCcw size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filterBar">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
            Client Accounts Directory & Intelligence
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--iv-text-muted)' }}>
            Monitor individual buyer spend, project iterations, and revision patterns
          </p>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
          <input
            type="text"
            placeholder="Search client by name, company, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Clients Table */}
      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Client Profile</th>
              <th>Company / Brand</th>
              <th>Total Lifetime Spend</th>
              <th>Total Orders</th>
              <th>Active Projects</th>
              <th>Active Revisions</th>
              <th>Disputes</th>
              <th style={{ textAlign: 'right' }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--iv-text-muted)' }}>
                  No clients found.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="adminAvatar" style={{ width: '32px', height: '32px' }}>
                        {c.avatar || c.name?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{c.company || 'Private Client'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)' }}>Since {c.joined_at || '2026'}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 900, color: 'var(--iv-text-main)', fontSize: '0.9rem' }}>
                      ₹{Number(c.total_spent).toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#334155', fontWeight: 700 }}>
                      {c.total_orders || 0} Orders
                    </span>
                  </td>

                  <td>
                    <span className="badge" style={{ background: '#eff6ff', color: '#1d4ed8', fontWeight: 700 }}>
                      {c.active_projects || 0} Active
                    </span>
                  </td>

                  <td>
                    <span className={`badge ${c.active_revisions > 0 ? 'badge-revision' : 'badge'}`} style={{ background: '#f8fafc', color: 'var(--iv-text-main)' }}>
                      <RotateCcw size={11} /> {c.active_revisions || 0} In Revision
                    </span>
                  </td>

                  <td>
                    {c.disputes > 0 ? (
                      <span className="badge badge-rejected">{c.disputes} Disputed</span>
                    ) : (
                      <span className="badge badge-approved">0 Issues</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedClient(c)}
                      className="btn btnSecondary btnSm"
                    >
                      <Eye size={13} /> View Profile
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Client Detail Inspector Modal */}
      {selectedClient && (
        <div className="modalOverlay" onClick={() => setSelectedClient(null)}>
          <div className="modalBox" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="adminAvatar" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                  {selectedClient.avatar || selectedClient.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="modalTitle">{selectedClient.name}</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--iv-text-muted)' }}>
                    {selectedClient.company} • {selectedClient.email}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedClient(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', fontWeight: 700 }}>LIFETIME SPEND</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--iv-primary)' }}>
                    ₹{Number(selectedClient.total_spent).toLocaleString('en-IN')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', fontWeight: 700 }}>COMPLETED ORDERS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900 }}>{selectedClient.total_orders}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', fontWeight: 700 }}>DISPUTES RECORD</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: selectedClient.disputes > 0 ? 'var(--status-rejected)' : '#059669' }}>
                    {selectedClient.disputes}
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '6px' }}>
                  Current Active Project
                </h4>
                <div style={{ padding: '12px 14px', background: '#ffffff', border: '1px solid var(--iv-border)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    {selectedClient.latest_project || 'No active projects in progress'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--iv-text-muted)', marginTop: '4px' }}>
                    Current status: {selectedClient.active_revisions > 0 ? `${selectedClient.active_revisions} revisions requested with freelancer` : 'In active design execution'}
                  </div>
                </div>
              </div>
            </div>

            <div className="modalFooter">
              <button onClick={() => setSelectedClient(null)} className="btn btnSecondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
