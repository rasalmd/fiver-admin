import React, { useState } from 'react';
import {
  Send,
  Eye,
  Clock,
  DollarSign,
  User,
  MessageSquare,
  Search,
  CheckCircle,
  Calendar,
} from 'lucide-react';

export default function RequestsView({ requests = [], loading = false }) {
  const [selectedReq, setSelectedReq] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = requests.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title?.toLowerCase().includes(q) ||
        r.client?.name?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      <div className="filterBar">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
            Client Custom RFQs & Proposals
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--iv-text-muted)' }}>
            Monitor tailored job postings and proposals submitted by freelancers
          </p>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
          <input
            type="text"
            placeholder="Search custom requests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Request Title & Category</th>
              <th>Client</th>
              <th>Target Budget</th>
              <th>Timeline</th>
              <th>Proposals Sent</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--iv-text-muted)' }}>
                  No custom requests found.
                </td>
              </tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--iv-text-main)', maxWidth: '300px' }}>
                      {req.title}
                    </div>
                    <span className="badge" style={{ background: '#f8fafc', color: '#475569', marginTop: '4px' }}>
                      {req.category}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>{req.client?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>{req.client?.company}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 800, color: 'var(--iv-text-main)', fontSize: '0.88rem' }}>
                      ₹{Number(req.budget).toLocaleString('en-IN')}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.78rem', color: 'var(--iv-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> {req.deadline_days} Days
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-primary">
                      {req.proposals_count || 0} Freelancers Bid
                    </span>
                  </td>

                  <td>
                    <span className={`badge ${req.status === 'awarded' ? 'badge-approved' : 'badge-pending'}`}>
                      {req.status === 'awarded' ? 'Awarded' : 'Open for Bids'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedReq(req)}
                      className="btn btnSecondary btnSm"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Inspect RFQ Modal */}
      {selectedReq && (
        <div className="modalOverlay" onClick={() => setSelectedReq(null)}>
          <div className="modalBox" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span className="badge badge-primary">{selectedReq.category}</span>
                <h3 className="modalTitle" style={{ marginTop: '4px' }}>{selectedReq.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="btn btnSecondary btnSm"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
              >
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '0.78rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 800 }}>
                  Project Description & Specifications
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--iv-text-main)', lineHeight: 1.5, marginTop: '4px' }}>
                  {selectedReq.description || 'Client is looking for high quality customized deliverables matching platform design standards.'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', fontWeight: 700 }}>Client Budget</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>₹{Number(selectedReq.budget).toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', fontWeight: 700 }}>Expected Timeline</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{selectedReq.deadline_days} Days</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', fontWeight: 700 }}>Proposals Received</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--iv-primary)' }}>{selectedReq.proposals_count || 0}</div>
                </div>
              </div>

              {selectedReq.proposals && selectedReq.proposals.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '8px' }}>
                    Freelancer Proposals
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedReq.proposals.map((prop, idx) => (
                      <div key={idx} style={{ padding: '10px 14px', border: '1px solid var(--iv-border)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.83rem' }}>{prop.freelancer_name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>{prop.pitch}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontWeight: 800, color: '#059669' }}>₹{Number(prop.bid_amount).toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)' }}>{prop.delivery_days} Days</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="modalFooter">
              <button onClick={() => setSelectedReq(null)} className="btn btnSecondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
