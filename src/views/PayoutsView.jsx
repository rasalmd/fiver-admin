import React, { useState } from 'react';
import {
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  ArrowDownLeft,
  Building2,
  DollarSign,
  Search,
  Check,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';

export default function PayoutsView({
  withdrawals = [],
  onProcessPayout,
  onRejectPayout,
  loading = false,
}) {
  const [filter, setFilter] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [search, setSearch] = useState('');

  const filtered = withdrawals.filter((w) => {
    if (filter !== 'all' && w.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        w.freelancer?.name?.toLowerCase().includes(q) ||
        w.payout_method?.toLowerCase().includes(q) ||
        w.transaction_id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPendingAmount = withdrawals
    .filter((w) => w.status === 'pending')
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const totalPaidAmount = withdrawals
    .filter((w) => w.status === 'processed')
    .reduce((sum, w) => sum + Number(w.amount || 0), 0);

  const handleConfirmPayout = () => {
    if (!selectedPayout) return;
    onProcessPayout(selectedPayout.id, transactionRef || `UTR-${Date.now().toString().slice(-8)}`);
    setSelectedPayout(null);
    setTransactionRef('');
  };

  const handleConfirmReject = () => {
    if (!rejectModal) return;
    onRejectPayout(rejectModal.id, rejectReason || 'Bank account details invalid');
    setRejectModal(null);
    setRejectReason('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 3 Metric Cards */}
      <div className="statsGrid">
        <div className="statCard">
          <div>
            <div className="statLabel">Pending Payout Queue</div>
            <div className="statValue" style={{ color: '#d97706' }}>
              ₹{totalPendingAmount.toLocaleString('en-IN')}
            </div>
            <div className="statDelta" style={{ color: '#d97706' }}>
              <Clock size={14} /> {withdrawals.filter((w) => w.status === 'pending').length} requests awaiting transfer
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Wallet size={22} />
          </div>
        </div>

        <div className="statCard">
          <div>
            <div className="statLabel">Total Freelancer Payouts Settled</div>
            <div className="statValue" style={{ color: '#059669' }}>
              ₹{totalPaidAmount.toLocaleString('en-IN')}
            </div>
            <div className="statDelta" style={{ color: '#059669' }}>
              <CheckCircle size={14} /> Transferred via NEFT / UPI
            </div>
          </div>
          <div className="statIconBox" style={{ background: '#ecfdf5', color: '#059669' }}>
            <ArrowDownLeft size={22} />
          </div>
        </div>

        <div className="statCard">
          <div>
            <div className="statLabel">Payout Security Status</div>
            <div className="statValue" style={{ fontSize: '1.25rem', color: 'var(--iv-primary)', marginTop: '12px' }}>
              Escrow Cleared
            </div>
            <div className="statDelta" style={{ color: 'var(--iv-text-muted)' }}>
              100% verified against completed deliverables
            </div>
          </div>
          <div className="statIconBox" style={{ background: 'var(--iv-primary-subtle)', color: 'var(--iv-primary)' }}>
            <Building2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="filterBar">
        <div className="tabGroup">
          <button
            onClick={() => setFilter('all')}
            className={`tabBtn ${filter === 'all' ? 'active' : ''}`}
          >
            All Withdrawals ({withdrawals.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`tabBtn ${filter === 'pending' ? 'active' : ''}`}
          >
            Pending Requests ({withdrawals.filter((w) => w.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('processed')}
            className={`tabBtn ${filter === 'processed' ? 'active' : ''}`}
          >
            Completed ({withdrawals.filter((w) => w.status === 'processed').length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
          <input
            type="text"
            placeholder="Search freelancer or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Withdrawals Table */}
      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Freelancer</th>
              <th>Requested Amount</th>
              <th>Payout Method</th>
              <th>Account Details</th>
              <th>Transaction Ref</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--iv-text-muted)' }}>
                  No withdrawal records found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="adminAvatar" style={{ width: '32px', height: '32px' }}>
                        {item.freelancer?.avatar || 'F'}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{item.freelancer?.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>{item.freelancer?.email}</div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 900, fontSize: '0.92rem', color: 'var(--iv-text-main)' }}>
                      ₹{Number(item.amount).toLocaleString('en-IN')}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)' }}>
                      Requested {item.requested_at || 'Recently'}
                    </div>
                  </td>

                  <td>
                    <span className="badge" style={{ background: '#f1f5f9', color: '#1e293b' }}>
                      {item.payout_method || 'Bank Transfer (NEFT)'}
                    </span>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--iv-text-main)' }}>
                      {item.account_details || 'HDFC Bank - A/C: ••••4821'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)' }}>
                      IFSC: HDFC0001824
                    </div>
                  </td>

                  <td>
                    {item.transaction_id ? (
                      <span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#059669', fontWeight: 700 }}>
                        {item.transaction_id}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.74rem', color: 'var(--iv-text-light)' }}>
                        Pending Transfer
                      </span>
                    )}
                  </td>

                  <td>
                    <span className={`badge ${item.status === 'processed' ? 'badge-approved' : item.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`}>
                      {item.status === 'processed' ? 'Paid / Settled' : item.status === 'rejected' ? 'Rejected' : 'Action Required'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    {item.status === 'pending' ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => {
                            setSelectedPayout(item);
                            setTransactionRef(`UTR-HDFC-${Math.floor(10000000 + Math.random() * 90000000)}`);
                          }}
                          className="btn btnSuccess btnSm"
                          disabled={loading}
                        >
                          <Check size={13} /> Process Payout
                        </button>
                        <button
                          onClick={() => {
                            setRejectModal(item);
                            setRejectReason('');
                          }}
                          className="btn btnDanger btnSm"
                          disabled={loading}
                        >
                          <X size={13} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--iv-text-light)' }}>
                        Settled {item.processed_at || ''}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Process Payout Modal */}
      {selectedPayout && (
        <div className="modalOverlay" onClick={() => setSelectedPayout(null)}>
          <div className="modalBox" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle">Confirm Freelancer Payout Transfer</h3>
              <button onClick={() => setSelectedPayout(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-light)' }}>TRANSFER AMOUNT</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--iv-primary)' }}>
                  ₹{Number(selectedPayout.amount).toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--iv-text-main)', marginTop: '4px' }}>
                  Payee: <strong>{selectedPayout.freelancer?.name}</strong> ({selectedPayout.account_details})
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                  Bank Reference Number / UTR ID *
                </label>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. UTR-HDFC-84920194"
                  className="input"
                  style={{ fontFamily: 'monospace', fontWeight: 700 }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)', marginTop: '4px', display: 'block' }}>
                  This reference will be visible to the freelancer in their wallet ledger.
                </span>
              </div>
            </div>

            <div className="modalFooter">
              <button onClick={() => setSelectedPayout(null)} className="btn btnSecondary">
                Cancel
              </button>
              <button onClick={handleConfirmPayout} className="btn btnSuccess" disabled={loading}>
                <Check size={14} /> Confirm & Mark as Paid
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal && (
        <div className="modalOverlay" onClick={() => setRejectModal(null)}>
          <div className="modalBox" style={{ maxWidth: '460px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalTitle" style={{ color: 'var(--status-rejected)' }}>Reject Withdrawal</h3>
              <button onClick={() => setRejectModal(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>
            <div className="modalBody">
              <p style={{ fontSize: '0.84rem', color: 'var(--iv-text-muted)', marginBottom: '12px' }}>
                Rejecting this request will restore <strong>₹{Number(rejectModal.amount).toLocaleString('en-IN')}</strong> back into {rejectModal.freelancer?.name}'s available wallet balance.
              </p>
              <textarea
                className="input"
                rows="3"
                style={{ height: 'auto', padding: '10px' }}
                placeholder="Reason (e.g. IFSC code mismatch or invalid bank account number)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            </div>
            <div className="modalFooter">
              <button onClick={() => setRejectModal(null)} className="btn btnSecondary">
                Cancel
              </button>
              <button onClick={handleConfirmReject} className="btn btnDanger" disabled={loading}>
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
