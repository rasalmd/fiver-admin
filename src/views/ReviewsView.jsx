import React, { useState } from 'react';
import {
  Star,
  Eye,
  EyeOff,
  AlertTriangle,
  Search,
  MessageCircle,
  CheckCircle,
  ThumbsUp,
} from 'lucide-react';

export default function ReviewsView({
  reviews = [],
  onToggleVisibility,
  loading = false,
}) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = reviews.filter((r) => {
    if (filter === 'flagged' && r.status !== 'flagged') return false;
    if (filter === 'published' && r.status !== 'published') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.review?.toLowerCase().includes(q) ||
        r.client?.name?.toLowerCase().includes(q) ||
        r.freelancer?.name?.toLowerCase().includes(q) ||
        r.order_ref?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            size={14}
            fill={s <= rating ? '#f59e0b' : 'none'}
            stroke="#f59e0b"
          />
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Filter and Search */}
      <div className="filterBar">
        <div className="tabGroup">
          <button
            onClick={() => setFilter('all')}
            className={`tabBtn ${filter === 'all' ? 'active' : ''}`}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`tabBtn ${filter === 'published' ? 'active' : ''}`}
          >
            Published ({reviews.filter((r) => r.status === 'published').length})
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`tabBtn ${filter === 'flagged' ? 'active' : ''}`}
          >
            Flagged / Disputed ({reviews.filter((r) => r.status === 'flagged').length})
          </button>
        </div>

        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
          <input
            type="text"
            placeholder="Search reviews or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="tableContainer">
        <table className="dataTable">
          <thead>
            <tr>
              <th>Order Ref & Service</th>
              <th>Rating</th>
              <th>Client Feedback & Testimonial</th>
              <th>Client</th>
              <th>Freelancer</th>
              <th>Visibility</th>
              <th style={{ textAlign: 'right' }}>Moderation</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--iv-text-muted)' }}>
                  No reviews found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <div style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--iv-primary)', fontSize: '0.8rem' }}>
                      {r.order_ref}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--iv-text-main)', fontWeight: 600, maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.service_title}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {renderStars(r.rating)}
                      <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{r.rating}.0</span>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.82rem', color: 'var(--iv-text-main)', lineHeight: 1.4, maxWidth: '380px' }}>
                      "{r.review}"
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', marginTop: '3px' }}>
                      Posted on {r.created_at || 'Recent'}
                    </div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{r.client?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)' }}>{r.client?.company}</div>
                  </td>

                  <td>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{r.freelancer?.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--iv-text-muted)' }}>{r.freelancer?.job}</div>
                  </td>

                  <td>
                    <span className={`badge ${r.status === 'published' ? 'badge-approved' : 'badge-rejected'}`}>
                      {r.status === 'published' ? 'Public' : 'Hidden / Flagged'}
                    </span>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => onToggleVisibility(r.id)}
                      className="btn btnSecondary btnSm"
                      disabled={loading}
                      title={r.status === 'published' ? 'Hide from public marketplace' : 'Publish to marketplace'}
                    >
                      {r.status === 'published' ? (
                        <>
                          <EyeOff size={13} /> Hide
                        </>
                      ) : (
                        <>
                          <Eye size={13} /> Publish
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
