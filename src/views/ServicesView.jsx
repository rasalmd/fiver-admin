import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Eye,
  Layers,
  Clock,
  DollarSign,
  AlertTriangle,
  ExternalLink,
  Search,
  Filter,
  Check,
  X,
  FileText,
  Sparkles,
  ShieldAlert,
  Star,
  Image as ImageIcon,
  MapPin,
  Briefcase,
  Mail,
  ShieldCheck,
  Tag,
  Calendar,
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

export default function ServicesView({
  services = [],
  onApprove,
  onReject,
  loading = false,
}) {
  const [filter, setFilter] = useState('all'); // all, pending_review, active, rejected
  const [selectedService, setSelectedService] = useState(null);
  const [activeMediaPreview, setActiveMediaPreview] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [approveModal, setApproveModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedReasonTag, setSelectedReasonTag] = useState('');
  const [search, setSearch] = useState('');

  const REJECT_REASONS = [
    'Low Resolution Artwork',
    'Unclear Package Scope',
    'Commercial Rights Missing',
    'Inappropriate / Prohibited Content',
    'Misleading Pricing Structure',
    'Incomplete Deliverables List',
  ];

  const filteredServices = services.filter((s) => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const titleMatch = s.title?.toLowerCase().includes(q);
      const authorMatch = s.freelancer_profile?.user?.name?.toLowerCase().includes(q);
      const catMatch = s.category?.toLowerCase().includes(q);
      const subcatMatch = s.subcategory?.toLowerCase().includes(q);
      return titleMatch || authorMatch || catMatch || subcatMatch;
    }
    return true;
  });

  const handleConfirmReject = () => {
    if (!rejectModal) return;
    const finalReason = selectedReasonTag
      ? `${selectedReasonTag}: ${rejectReason || 'Does not meet marketplace standards'}`
      : rejectReason || 'Requires revision to meet marketplace quality guidelines.';

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
      {/* Top Section Header & Filter */}
      <div className="filterBar">
        <div className="tabGroup">
          <button
            onClick={() => setFilter('all')}
            className={`tabBtn ${filter === 'all' ? 'active' : ''}`}
          >
            All Services ({services.length})
          </button>
          <button
            onClick={() => setFilter('pending_review')}
            className={`tabBtn ${filter === 'pending_review' ? 'active' : ''}`}
          >
            Pending Review ({services.filter((s) => s.status === 'pending_review').length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`tabBtn ${filter === 'active' ? 'active' : ''}`}
          >
            Approved ({services.filter((s) => s.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`tabBtn ${filter === 'rejected' ? 'active' : ''}`}
          >
            Rejected ({services.filter((s) => s.status === 'rejected').length})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
            <input
              type="text"
              placeholder="Search gigs, category or creator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
            />
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Service Details</th>
              <th>Creator / Freelancer</th>
              <th>Category & Subcategory</th>
              <th>3-Tier Packages</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--iv-text-muted)' }}>
                  No services found matching current filters.
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img
                        src={resolveImg(service.featured_image)}
                        alt={service.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/image/services/motion-design.jpg';
                        }}
                        style={{ width: '56px', height: '42px', borderRadius: '4px', objectFit: 'cover' }}
                      />
                      <div style={{ maxWidth: '320px' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--iv-text-main)', lineHeight: 1.3 }}>
                          {service.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-light)', marginTop: '2px' }}>
                          ID: #{service.id} • {service.orders_completed || 0} Orders Completed
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.83rem' }}>
                      {service.freelancer_profile?.user?.name || 'Alex Vance'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)' }}>
                      {service.freelancer_profile?.professional_title || service.freelancer_profile?.job || 'Creative Specialist'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--iv-primary)', marginTop: '2px', fontWeight: 700 }}>
                      ★ {service.rating || '5.0'} ({service.review_count || 0} reviews)
                    </div>
                  </td>
                  <td>
                    <span className="badge" style={{ background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', display: 'inline-block' }}>
                      {service.category}
                    </span>
                    {service.subcategory && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)', marginTop: '3px' }}>
                        ↳ {service.subcategory}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {service.packages?.map((pkg, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '4px 7px',
                            background: '#f8fafc',
                            border: '1px solid var(--iv-border)',
                            borderRadius: '4px',
                            textAlign: 'center',
                            minWidth: '54px',
                          }}
                        >
                          <div style={{ fontSize: '0.65rem', color: 'var(--iv-text-light)', textTransform: 'uppercase' }}>
                            {pkg.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                            ₹{Number(pkg.price).toLocaleString('en-IN')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${
                      service.status === 'active'
                        ? 'badge-approved'
                        : service.status === 'rejected'
                        ? 'badge-rejected'
                        : 'badge-pending'
                    }`}>
                      {service.status === 'active' ? 'Approved' : service.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => {
                          setSelectedService(service);
                          setActiveMediaPreview(service.featured_image);
                        }}
                        className="btn btnSecondary btnSm"
                        title="Inspect Service & Scope"
                      >
                        <Eye size={13} /> Inspect
                      </button>

                      {service.status !== 'active' && (
                        <button
                          onClick={() => setApproveModal(service)}
                          className="btn btnSuccess btnSm"
                          title="Approve to Marketplace"
                          disabled={loading}
                        >
                          <Check size={13} /> Approve
                        </button>
                      )}

                      {service.status !== 'rejected' && (
                        <button
                          onClick={() => {
                            setRejectModal(service);
                            setRejectReason('');
                            setSelectedReasonTag('');
                          }}
                          className="btn btnDanger btnSm"
                          title="Reject or Request Revision"
                          disabled={loading}
                        >
                          <X size={13} /> Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 1. Full Service & Scope Inspector Modal */}
      {selectedService && (() => {
        const allImages = Array.from(new Set([
          selectedService.featured_image,
          ...(Array.isArray(selectedService.gallery) ? selectedService.gallery : []),
        ])).filter(Boolean);

        const currentPreview = activeMediaPreview || selectedService.featured_image || allImages[0];

        return (
          <div className="modalOverlay" onClick={() => setSelectedService(null)}>
            <div className="modalBox" style={{ maxWidth: '840px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
              <div className="modalHeader" style={{ borderBottom: '1px solid var(--iv-border)', paddingBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                      {selectedService.category} {selectedService.subcategory ? `• ${selectedService.subcategory}` : ''}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--iv-text-light)', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                      ID: #{selectedService.id}
                    </span>
                    {selectedService.slug && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)', fontFamily: 'monospace' }}>
                        /{selectedService.slug}
                      </span>
                    )}
                  </div>
                  <h3 className="modalTitle" style={{ lineHeight: 1.35, fontSize: '1.15rem' }}>
                    {selectedService.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedService(null)}
                  className="btn btnSecondary btnSm"
                  style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                >
                  ✕
                </button>
              </div>

              <div className="modalBody" style={{ overflowY: 'auto', paddingRight: '12px' }}>
                {/* 1. Visual Showcase & Gallery Preview */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ position: 'relative', width: '100%', height: '320px', backgroundColor: '#090d16', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--iv-border)' }}>
                    <img
                      src={resolveImg(currentPreview)}
                      alt="Service preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/image/services/motion-design.jpg';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ImageIcon size={13} /> {currentPreview === selectedService.featured_image ? 'Cover Artwork (16:9)' : 'Gallery Showcase'}
                    </div>
                    <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                      {allImages.length} Visual Assets
                    </div>
                  </div>

                  {/* Thumbnail Carousel / Selector */}
                  {allImages.length > 1 && (
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                      {allImages.map((img, idx) => {
                        const isSelected = currentPreview === img;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setActiveMediaPreview(img)}
                            style={{
                              position: 'relative',
                              width: '84px',
                              height: '56px',
                              flexShrink: 0,
                              borderRadius: '6px',
                              overflow: 'hidden',
                              border: isSelected ? '2px solid var(--iv-primary)' : '1px solid var(--iv-border)',
                              padding: 0,
                              cursor: 'pointer',
                              opacity: isSelected ? 1 : 0.65,
                              transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                              transition: 'all 0.15s ease',
                              background: '#090d16',
                            }}
                            title={`Inspect Asset ${idx + 1}`}
                          >
                            <img
                              src={resolveImg(img)}
                              alt={`Thumbnail ${idx + 1}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/image/services/brand-identity-luxury.jpg';
                              }}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {img === selectedService.featured_image && (
                              <span style={{ position: 'absolute', bottom: '2px', left: '2px', background: 'var(--iv-primary)', color: '#fff', fontSize: '0.55rem', fontWeight: 800, padding: '1px 3px', borderRadius: '2px' }}>
                                Cover
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. Key Metrics Strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)', marginBottom: '18px' }}>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Rating Score</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, fontSize: '0.95rem', color: '#b45309', marginTop: '2px' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" /> {selectedService.rating || '5.00'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)' }}>{selectedService.review_count || 0} Client Reviews</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Orders Completed</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--iv-text-main)', marginTop: '2px' }}>
                      {selectedService.orders_completed || 0} Orders
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>100% Fulfillment</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Moderation Status</div>
                    <div style={{ marginTop: '2px' }}>
                      <span className={`badge ${selectedService.status === 'active' ? 'badge-approved' : selectedService.status === 'rejected' ? 'badge-rejected' : 'badge-pending'}`} style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                        {selectedService.status === 'active' ? 'Approved & Live' : selectedService.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)', marginTop: '2px' }}>Marketplace status</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--iv-text-light)', textTransform: 'uppercase', fontWeight: 700 }}>Submitted On</div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--iv-text-main)', marginTop: '2px' }}>
                      {selectedService.created_at ? new Date(selectedService.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)' }}>Verified Creator</div>
                  </div>
                </div>

                {/* 3. Freelancer Creator Profile Card */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', background: '#ffffff', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)', marginBottom: '18px' }}>
                  <div className="adminAvatar" style={{ width: '48px', height: '48px', fontSize: '1.1rem', flexShrink: 0 }}>
                    {selectedService.freelancer_profile?.user?.name?.charAt(0) || 'F'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--iv-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {selectedService.freelancer_profile?.user?.name || 'Alex Vance'}
                          <span style={{ fontSize: '0.68rem', color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '1px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <ShieldCheck size={11} /> Verified Talent
                          </span>
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--iv-text-muted)', marginTop: '2px' }}>
                          {selectedService.freelancer_profile?.professional_title || 'Creative Specialist'}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--iv-primary)' }}>
                          ₹{selectedService.freelancer_profile?.hourly_rate ? Number(selectedService.freelancer_profile.hourly_rate).toLocaleString('en-IN') : '1,200'}/hr
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)' }}>
                          {selectedService.freelancer_profile?.location || 'San Francisco, CA & Remote'}
                        </div>
                      </div>
                    </div>
                    {selectedService.freelancer_profile?.bio && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--iv-text-muted)', lineHeight: 1.45, marginTop: '8px', borderTop: '1px dashed var(--iv-border)', paddingTop: '8px' }}>
                        "{selectedService.freelancer_profile.bio}"
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '14px', fontSize: '0.72rem', color: 'var(--iv-text-light)', marginTop: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {selectedService.freelancer_profile?.user?.email || 'freelancer@illuvision.com'}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Briefcase size={12} /> {selectedService.freelancer_profile?.experience_years || 8}+ Years Experience
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Skills & Search Tags */}
                {Array.isArray(selectedService.skills) && selectedService.skills.length > 0 && (
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--iv-text-light)', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Tag size={12} /> SKILLS & MARKETPLACE SEARCH KEYWORDS
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {selectedService.skills.map((skill, si) => (
                        <span
                          key={si}
                          style={{
                            background: '#ffffff',
                            border: '1px solid var(--iv-border)',
                            color: 'var(--iv-text-main)',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            padding: '3px 9px',
                            borderRadius: '100px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                          }}
                        >
                          #{skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Full Service Description */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--iv-text-light)', textTransform: 'uppercase', marginBottom: '6px' }}>
                    SERVICE SCOPE & DESCRIPTION
                  </div>
                  <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)' }}>
                    <p style={{ fontSize: '0.84rem', color: 'var(--iv-text-main)', lineHeight: 1.55, margin: 0, whiteSpace: 'pre-line' }}>
                      {selectedService.description}
                    </p>
                  </div>
                </div>

                {/* 6. 3-Tier Package Comparison Cards */}
                <h4 style={{ fontSize: '0.88rem', fontWeight: 800, marginBottom: '12px', color: 'var(--iv-text-main)' }}>
                  Configured Service Packages (Tier 1 - 3)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
                  {selectedService.packages?.map((pkg, idx) => (
                    <div
                      key={idx}
                      style={{
                        border: idx === 1 ? '2px solid var(--iv-primary)' : '1px solid var(--iv-border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        background: idx === 1 ? 'var(--iv-primary-subtle)' : '#ffffff',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', color: idx === 1 ? 'var(--iv-primary)' : 'var(--iv-text-muted)' }}>
                          {pkg.name}
                        </span>
                        {idx === 1 && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>Popular</span>}
                      </div>

                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--iv-text-main)', marginBottom: '8px' }}>
                        ₹{Number(pkg.price).toLocaleString('en-IN')}
                      </div>

                      <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-muted)', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div>⏱ {pkg.delivery_days} Days Delivery</div>
                        <div>🔄 {pkg.revisions === 99 ? 'Unlimited' : `${pkg.revisions} Revisions`}</div>
                      </div>

                      <div style={{ flex: 1, borderTop: '1px solid var(--iv-border)', paddingTop: '10px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--iv-text-light)', marginBottom: '6px' }}>
                          INCLUDED DELIVERABLES:
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          {Array.isArray(pkg.features) && pkg.features.map((f, fi) => (
                            <li key={fi} style={{ fontSize: '0.74rem', color: 'var(--iv-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Check size={12} color="#059669" /> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modalFooter" style={{ borderTop: '1px solid var(--iv-border)', paddingTop: '12px' }}>
                <button onClick={() => setSelectedService(null)} className="btn btnSecondary">
                  Close
                </button>
                {selectedService.status !== 'active' && (
                  <button
                    onClick={() => {
                      setApproveModal(selectedService);
                      setSelectedService(null);
                    }}
                    className="btn btnSuccess"
                  >
                    <Check size={14} /> Approve & Publish
                  </button>
                )}
                {selectedService.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      setRejectModal(selectedService);
                      setSelectedService(null);
                    }}
                    className="btn btnDanger"
                  >
                    <X size={14} /> Reject with Note
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. Proper Reject Reason Modal Popup */}
      {rejectModal && (
        <div className="modalOverlay" onClick={() => setRejectModal(null)}>
          <div className="modalBox" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader" style={{ borderBottom: '1px solid rgba(225, 29, 72, 0.2)', background: 'var(--status-rejected-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={20} color="var(--status-rejected)" />
                <h3 className="modalTitle" style={{ color: 'var(--status-rejected)' }}>
                  Reject Service Submission
                </h3>
              </div>
              <button onClick={() => setRejectModal(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--iv-text-muted)' }}>REJECTING SERVICE</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--iv-text-main)', marginTop: '2px' }}>
                  {rejectModal.title}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-light)' }}>
                  Created by {rejectModal.freelancer_profile?.user?.name || 'Freelancer'}
                </div>
              </div>

              {/* Quick Select Chips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                  SELECT PRIMARY REASON CATEGORY:
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

              {/* Specific Feedback Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                  FEEDBACK NOTE TO FREELANCER (ACTIONABLE GUIDELINES):
                </label>
                <textarea
                  className="input"
                  rows="4"
                  style={{ height: 'auto', padding: '10px', fontSize: '0.82rem' }}
                  placeholder="Explain exactly what the freelancer needs to update (e.g. Please upload high-resolution 300DPI preview artwork and clarify standard tier revisions)..."
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

      {/* 3. Proper Approve Confirmation Modal Popup */}
      {approveModal && (
        <div className="modalOverlay" onClick={() => setApproveModal(null)}>
          <div className="modalBox" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader" style={{ borderBottom: '1px solid rgba(5, 150, 105, 0.2)', background: '#ecfdf5' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle size={20} color="#059669" />
                <h3 className="modalTitle" style={{ color: '#059669' }}>
                  Confirm Service Approval
                </h3>
              </div>
              <button onClick={() => setApproveModal(null)} className="btn btnSecondary btnSm" style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}>
                ✕
              </button>
            </div>

            <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--iv-text-main)', lineHeight: 1.5 }}>
                Are you sure you want to approve <strong>"{approveModal.title}"</strong>?
              </p>
              <div style={{ padding: '12px 14px', background: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)', fontSize: '0.78rem', color: 'var(--iv-text-muted)' }}>
                ✓ This service will immediately become <strong>Live & Searchable</strong> on the public IlluVision marketplace.<br />
                ✓ Clients will be able to order packages starting at ₹{approveModal.packages?.[0]?.price || 2499}.
              </div>
            </div>

            <div className="modalFooter">
              <button onClick={() => setApproveModal(null)} className="btn btnSecondary">
                Cancel
              </button>
              <button onClick={handleConfirmApprove} className="btn btnSuccess" disabled={loading}>
                <Check size={14} /> Yes, Publish to Marketplace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
