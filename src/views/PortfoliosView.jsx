import React, { useState } from 'react';
import {
  Check,
  X,
  Eye,
  ExternalLink,
  Search,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  Tag,
  ShieldAlert,
} from 'lucide-react';

const resolveImg = (src) => {
  if (!src) return '/assets/image/services/motion-design.jpg';
  if (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  if (src.startsWith('/storage/')) {
    return `http://127.0.0.1:8000${src}`;
  }
  if (src.startsWith('storage/')) {
    return `http://127.0.0.1:8000/${src}`;
  }
  if (src.startsWith('/assets/')) {
    return src;
  }
  return src;
};

export default function PortfoliosView({
  portfolios = [],
  onApprove,
  onReject,
  loading = false,
}) {
  const [filter, setFilter] = useState('all'); // all, pending_review, approved, rejected
  const [selectedItem, setSelectedItem] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReasonTag, setSelectedReasonTag] = useState('');
  const [search, setSearch] = useState('');

  const REJECT_REASONS = [
    'Not Original Artwork / Stock Rip',
    'Low Visual Fidelity / Artifacts',
    'Broken Live Project URL',
    'Violates Marketplace Guidelines',
    'Irrelevant Category Assignment',
  ];

  const filtered = portfolios.filter((item) => {
    const itemStatus = item.status === 'published' ? 'approved' : item.status;
    if (filter !== 'all' && itemStatus !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.freelancer?.name?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleConfirmReject = () => {
    if (!rejectModal) return;
    const finalReason = selectedReasonTag
      ? `${selectedReasonTag}: ${rejectReason || 'Declined per portfolio guidelines.'}`
      : rejectReason || 'Declined per portfolio guidelines.';
    onReject(rejectModal.id, finalReason);
    setRejectModal(null);
    setRejectReason('');
    setSelectedReasonTag('');
  };

  const handleConfirmApprove = () => {
    if (!approveModal) return;
    onApprove(approveModal.id);
    setApproveModal(null);
  };

  return (
    <div>
      {/* Filter and Search Bar */}
      <div className="filterBar">
        <div className="tabGroup">
          <button
            onClick={() => setFilter('all')}
            className={`tabBtn ${filter === 'all' ? 'active' : ''}`}
          >
            All Items ({portfolios.length})
          </button>
          <button
            onClick={() => setFilter('pending_review')}
            className={`tabBtn ${filter === 'pending_review' ? 'active' : ''}`}
          >
            Pending Review ({portfolios.filter((p) => p.status === 'pending_review').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`tabBtn ${filter === 'approved' ? 'active' : ''}`}
          >
            Approved ({portfolios.filter((p) => p.status === 'approved' || p.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`tabBtn ${filter === 'rejected' ? 'active' : ''}`}
          >
            Rejected ({portfolios.filter((p) => p.status === 'rejected').length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
          <input
            type="text"
            placeholder="Search portfolios, tags or designer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Grid of Portfolio Media Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#ffffff', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)', color: 'var(--iv-text-muted)' }}>
            No portfolio items found matching current filters.
          </div>
        ) : (
          filtered.map((item) => (
            <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative', width: '100%', height: '190px', overflow: 'hidden', background: '#0f172a' }}>
                <img
                  src={resolveImg(item.image_url)}
                  alt={item.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/image/services/motion-design.jpg';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                />
                <span
                  className={`badge ${
                    item.status === 'approved' || item.status === 'published'
                      ? 'badge-approved'
                      : item.status === 'rejected'
                      ? 'badge-rejected'
                      : 'badge-pending'
                  }`}
                  style={{ position: 'absolute', top: '10px', right: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.25)' }}
                >
                  {item.status === 'approved' || item.status === 'published' ? 'Approved' : item.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                </span>
              </div>

              <div className="cardBody" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--iv-primary)', textTransform: 'uppercase' }}>
                    {item.category || 'Creative Work'}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)' }}>
                    {item.completed_at ? `Done ${item.completed_at}` : 'Recent'}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--iv-text-main)', lineHeight: 1.3, marginBottom: '6px' }}>
                  {item.title}
                </h3>

                <p style={{ fontSize: '0.76rem', color: 'var(--iv-text-muted)', lineHeight: 1.4, marginBottom: '12px', flex: 1 }}>
                  {item.description}
                </p>

                {/* Freelancer Author Info */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--iv-border)', borderBottom: '1px solid var(--iv-border)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="adminAvatar" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>
                      {item.freelancer?.avatar || 'F'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.78rem' }}>{item.freelancer?.name || 'Alex Vance'}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--iv-text-light)' }}>{item.freelancer?.job || 'Designer'}</div>
                    </div>
                  </div>

                  {item.project_url && (
                    <a
                      href={item.project_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.72rem', color: 'var(--iv-primary)', display: 'flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontWeight: 700 }}
                    >
                      Live Demo <ExternalLink size={12} />
                    </a>
                  )}
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {item.tags?.map((tag, ti) => (
                    <span key={ti} style={{ fontSize: '0.68rem', padding: '2px 6px', background: '#f1f5f9', color: '#475569', borderRadius: '3px', fontWeight: 600 }}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="btn btnSecondary btnSm"
                    style={{ flex: 1 }}
                  >
                    <Eye size={13} /> Full Preview
                  </button>

                  {item.status !== 'approved' && item.status !== 'published' && (
                    <button
                      onClick={() => setApproveModal(item)}
                      className="btn btnSuccess btnSm"
                      disabled={loading}
                      title="Approve to Designer Showcase"
                    >
                      <Check size={13} /> Approve
                    </button>
                  )}

                  {item.status !== 'rejected' && (
                    <button
                      onClick={() => {
                        setRejectModal(item);
                        setRejectReason('');
                        setSelectedReasonTag('');
                      }}
                      className="btn btnDanger btnSm"
                      disabled={loading}
                      title="Reject Submission"
                    >
                      <X size={13} /> Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 1. Lightbox Modal */}
      {selectedItem && (
        <div className="modalOverlay" onClick={() => setSelectedItem(null)}>
          <div className="modalBox" style={{ maxWidth: '800px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <div>
                <span className="badge badge-primary">{selectedItem.category}</span>
                <h3 className="modalTitle" style={{ marginTop: '4px' }}>{selectedItem.title}</h3>
              </div>
              <button onClick={() => setSelectedItem(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>
            <div className="modalBody">
              <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={resolveImg(selectedItem.image_url)}
                  alt={selectedItem.title}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/image/services/motion-design.jpg';
                  }}
                  style={{ maxWidth: '100%', maxHeight: '420px', objectFit: 'contain' }}
                />
              </div>

              <div style={{ marginTop: '16px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--iv-text-main)', lineHeight: 1.5 }}>
                  {selectedItem.description}
                </p>
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedItem.tags?.map((t, idx) => (
                    <span key={idx} className="badge" style={{ background: '#f8fafc', color: 'var(--iv-text-main)', border: '1px solid #e2e8f0' }}>
                      <Tag size={11} /> {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="modalFooter">
              <button onClick={() => setSelectedItem(null)} className="btn btnSecondary">
                Close
              </button>
              {selectedItem.status !== 'approved' && selectedItem.status !== 'published' && (
                <button
                  onClick={() => {
                    setApproveModal(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="btn btnSuccess"
                >
                  <Check size={14} /> Approve Showcase
                </button>
              )}
              {selectedItem.status !== 'rejected' && (
                <button
                  onClick={() => {
                    setRejectModal(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="btn btnDanger"
                >
                  <X size={14} /> Reject with Note
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Proper Reject Portfolio Modal Popup */}
      {rejectModal && (
        <div className="modalOverlay" onClick={() => setRejectModal(null)}>
          <div className="modalBox" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader" style={{ borderBottom: '1px solid rgba(225, 29, 72, 0.2)', background: 'var(--status-rejected-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={20} color="var(--status-rejected)" />
                <h3 className="modalTitle" style={{ color: 'var(--status-rejected)' }}>
                  Reject Portfolio Submission
                </h3>
              </div>
              <button onClick={() => setRejectModal(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-muted)' }}>PROJECT SHOWCASE</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--iv-text-main)', marginTop: '2px' }}>
                  {rejectModal.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-light)' }}>
                  Category: {rejectModal.category}
                </div>
              </div>

              {/* Quick Select Chips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                  PRIMARY REJECTION REASON:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {REJECT_REASONS.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedReasonTag(r)}
                      style={{
                        padding: '5px 10px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        border: selectedReasonTag === r ? '1px solid var(--status-rejected)' : '1px solid var(--iv-border)',
                        background: selectedReasonTag === r ? 'var(--status-rejected-bg)' : '#ffffff',
                        color: selectedReasonTag === r ? 'var(--status-rejected)' : 'var(--iv-text-main)',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Note */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                  CURATION FEEDBACK:
                </label>
                <textarea
                  className="input"
                  rows="3"
                  style={{ height: 'auto', padding: '10px', fontSize: '0.82rem' }}
                  placeholder="Explain why this portfolio piece was declined (e.g. Please provide live Figma or Behance working link verifying authorship)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                />
              </div>
            </div>

            <div className="modalFooter">
              <button onClick={() => setRejectModal(null)} className="btn btnSecondary">
                Cancel
              </button>
              <button onClick={handleConfirmReject} className="btn btnDanger" disabled={loading}>
                <X size={14} /> Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Proper Approve Portfolio Modal Popup */}
      {approveModal && (
        <div className="modalOverlay" onClick={() => setApproveModal(null)}>
          <div className="modalBox" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader" style={{ borderBottom: '1px solid rgba(5, 150, 105, 0.2)', background: '#ecfdf5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#059669" />
                <h3 className="modalTitle" style={{ color: '#059669' }}>
                  Verify & Approve Portfolio Piece
                </h3>
              </div>
              <button onClick={() => setApproveModal(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--iv-text-main)', lineHeight: 1.5 }}>
                Publish <strong>"{approveModal.title}"</strong> to the public IlluVision Designer Showcase?
              </p>
              <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)', fontSize: '0.78rem', color: 'var(--iv-text-muted)' }}>
                ✓ This item will be featured on the freelancer's public profile and portfolio gallery.<br />
                ✓ Verified badge will be granted for this work.
              </div>
            </div>

            <div className="modalFooter">
              <button onClick={() => setApproveModal(null)} className="btn btnSecondary">
                Cancel
              </button>
              <button onClick={handleConfirmApprove} className="btn btnSuccess" disabled={loading}>
                <Check size={14} /> Yes, Publish Showcase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
