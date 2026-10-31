import React, { useState } from 'react';
import {
  Plus,
  Tag,
  Check,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  FolderPlus,
  GitBranch,
  Search,
  Image as ImageIcon,
  ChevronRight,
} from 'lucide-react';

export default function CategoriesView({
  categories = {},
  onCreateCategory,
  onCreateSubcategory,
  loading = false,
}) {
  const [activeTab, setActiveTab] = useState('services'); // 'services' or 'portfolios'
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [selectedParentCat, setSelectedParentCat] = useState('');
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('service');
  const [subName, setSubName] = useState('');
  const [search, setSearch] = useState('');

  // Extract lists safely
  const serviceCategories = Array.isArray(categories?.service_categories)
    ? categories.service_categories
    : Array.isArray(categories)
    ? categories
    : [];
  const portfolioCategories = Array.isArray(categories?.portfolio_categories)
    ? categories.portfolio_categories
    : [];

  const filteredServiceCats = serviceCategories.filter((cat) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const nameMatch = cat.name?.toLowerCase().includes(q);
    const subMatch = cat.subcategories?.some((s) => s.name?.toLowerCase().includes(q));
    return nameMatch || subMatch;
  });

  const filteredPortCats = portfolioCategories.filter((cat) => {
    if (!search.trim()) return true;
    return cat.name?.toLowerCase().includes(search.toLowerCase());
  });

  const handleCreateCategorySubmit = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;
    onCreateCategory({ name: catName, type: catType });
    setCatName('');
    setShowAddCatModal(false);
  };

  const handleCreateSubcategorySubmit = (e) => {
    e.preventDefault();
    if (!subName.trim() || !selectedParentCat) return;
    onCreateSubcategory({
      category_name: selectedParentCat,
      subcategory_name: subName,
    });
    setSubName('');
    setShowAddSubModal(false);
  };

  const openAddSubcategoryFor = (parentName) => {
    setSelectedParentCat(parentName);
    setSubName('');
    setShowAddSubModal(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Filter Tabs & Add Buttons */}
      <div className="filterBar">
        <div className="tabGroup">
          <button
            onClick={() => setActiveTab('services')}
            className={`tabBtn ${activeTab === 'services' ? 'active' : ''}`}
          >
            <Layers size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Service Categories ({serviceCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('portfolios')}
            className={`tabBtn ${activeTab === 'portfolios' ? 'active' : ''}`}
          >
            <ImageIcon size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Portfolio Categories ({portfolioCategories.length})
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--iv-text-light)' }} />
            <input
              type="text"
              placeholder="Search category / subcategory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '0.8rem' }}
            />
          </div>

          {activeTab === 'services' ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setCatType('service');
                  setCatName('');
                  setShowAddCatModal(true);
                }}
                className="btn btnPrimary"
              >
                <FolderPlus size={15} /> Add Category
              </button>
              <button
                onClick={() => {
                  setSelectedParentCat(serviceCategories[0]?.name || '');
                  setSubName('');
                  setShowAddSubModal(true);
                }}
                className="btn btnSecondary"
              >
                <GitBranch size={15} /> Add Subcategory
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setCatType('portfolio');
                setCatName('');
                setShowAddCatModal(true);
              }}
              className="btn btnPrimary"
            >
              <Plus size={15} /> Add Portfolio Category
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: Service Categories & Subcategories */}
      {activeTab === 'services' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                Freelancer Service Taxonomies & Subcategories
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--iv-text-muted)' }}>
                All categories and subcategories created by freelancers or administrators for gig routing
              </p>
            </div>
            <span className="badge badge-primary">
              {serviceCategories.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)} Total Subcategories
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '18px' }}>
            {filteredServiceCats.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)', color: 'var(--iv-text-muted)' }}>
                No service categories found. Click "Add Category" above to create one.
              </div>
            ) : (
              filteredServiceCats.map((cat, idx) => (
                <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div className="cardBody">
                    {/* Category Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--iv-primary-subtle)', color: 'var(--iv-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Tag size={20} />
                      </div>
                      <span className="badge badge-primary">
                        {cat.services_count || 0} Gigs
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--iv-text-main)', marginBottom: '4px' }}>
                      {cat.name}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-light)', fontFamily: 'monospace', marginBottom: '12px' }}>
                      slug: /{cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    </div>

                    {/* Subcategories Section */}
                    <div style={{ borderTop: '1px solid var(--iv-border-subtle)', paddingTop: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--iv-text-muted)', textTransform: 'uppercase' }}>
                          SUBCATEGORIES ({cat.subcategories?.length || 0})
                        </span>
                        <button
                          type="button"
                          onClick={() => openAddSubcategoryFor(cat.name)}
                          className="btn btnSecondary btnSm"
                          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                          title={`Add subcategory under ${cat.name}`}
                        >
                          <Plus size={11} /> Add Sub
                        </button>
                      </div>

                      {cat.subcategories && cat.subcategories.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {cat.subcategories.map((sub, si) => (
                            <span
                              key={si}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.74rem',
                                padding: '3px 8px',
                                background: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                color: '#1e293b',
                                fontWeight: 600,
                              }}
                            >
                              <GitBranch size={10} color="var(--iv-primary)" />
                              {sub.name}
                              {sub.services_count > 0 && (
                                <span style={{ fontSize: '0.65rem', color: 'var(--iv-text-light)', marginLeft: '2px' }}>
                                  ({sub.services_count})
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-light)', fontStyle: 'italic' }}>
                          No subcategories added yet. Click "+ Add Sub" to organize this category.
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '10px 20px', background: '#fafafa', borderTop: '1px solid var(--iv-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--status-approved)', fontWeight: 700 }}>
                      ● Active Marketplace Taxonomy
                    </span>
                    <button
                      type="button"
                      onClick={() => openAddSubcategoryFor(cat.name)}
                      className="btn btnSecondary btnSm"
                      style={{ padding: '3px 10px', fontSize: '0.72rem' }}
                    >
                      <Plus size={12} /> Add Subcategory
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 2: Portfolio Categories */}
      {activeTab === 'portfolios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                Freelancer Portfolio Showcase Categories
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--iv-text-muted)' }}>
                Categories created by freelancers to exhibit their creative artwork and design cases
              </p>
            </div>
            <span className="badge badge-primary">
              {portfolioCategories.reduce((acc, c) => acc + (c.portfolio_count || 0), 0)} Showcase Items Total
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {filteredPortCats.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: '#fff', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-border)', color: 'var(--iv-text-muted)' }}>
                No portfolio categories found.
              </div>
            ) : (
              filteredPortCats.map((cat, idx) => (
                <div key={idx} className="card">
                  <div className="cardBody">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <div style={{ width: '38px', height: '38px', borderRadius: 'var(--radius-md)', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={18} />
                      </div>
                      <span className="badge badge-approved">
                        {cat.portfolio_count || 0} Creative Works
                      </span>
                    </div>

                    <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--iv-text-main)', marginBottom: '4px' }}>
                      {cat.name}
                    </h3>
                    <div style={{ fontSize: '0.72rem', color: 'var(--iv-text-light)', fontFamily: 'monospace' }}>
                      slug: /{cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    </div>
                  </div>

                  <div style={{ padding: '8px 18px', background: '#fafafa', borderTop: '1px solid var(--iv-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--iv-text-muted)', fontWeight: 600 }}>
                      Portfolio Filter Tag
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--iv-primary)', fontWeight: 700 }}>
                      Showcase Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: Add Category Modal */}
      {showAddCatModal && (
        <div className="modalOverlay" onClick={() => setShowAddCatModal(false)}>
          <div className="modalBox" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateCategorySubmit}>
              <div className="modalHeader">
                <h3 className="modalTitle">
                  Create New {catType === 'service' ? 'Service' : 'Portfolio'} Category
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddCatModal(false)}
                  className="btn btnSecondary btnSm"
                  style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                >
                  ✕
                </button>
              </div>

              <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                    Category Type *
                  </label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setCatType('service')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: catType === 'service' ? '2px solid var(--iv-primary)' : '1px solid var(--iv-border)',
                        background: catType === 'service' ? 'var(--iv-primary-subtle)' : '#ffffff',
                        color: catType === 'service' ? 'var(--iv-primary)' : 'var(--iv-text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      Service Category
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatType('portfolio')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        border: catType === 'portfolio' ? '2px solid var(--iv-primary)' : '1px solid var(--iv-border)',
                        background: catType === 'portfolio' ? 'var(--iv-primary-subtle)' : '#ffffff',
                        color: catType === 'portfolio' ? 'var(--iv-primary)' : 'var(--iv-text-muted)',
                        cursor: 'pointer',
                      }}
                    >
                      Portfolio Category
                    </button>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AI & Generative Artwork"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div className="modalFooter">
                <button type="button" onClick={() => setShowAddCatModal(false)} className="btn btnSecondary">
                  Cancel
                </button>
                <button type="submit" className="btn btnPrimary" disabled={loading}>
                  <Plus size={14} /> Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Add Subcategory Modal under Category */}
      {showAddSubModal && (
        <div className="modalOverlay" onClick={() => setShowAddSubModal(false)}>
          <div className="modalBox" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleCreateSubcategorySubmit}>
              <div className="modalHeader">
                <h3 className="modalTitle">Create Subcategory</h3>
                <button
                  type="button"
                  onClick={() => setShowAddSubModal(false)}
                  className="btn btnSecondary btnSm"
                  style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                >
                  ✕
                </button>
              </div>

              <div className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                    Parent Category *
                  </label>
                  <select
                    className="input"
                    value={selectedParentCat}
                    onChange={(e) => setSelectedParentCat(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select parent category...</option>
                    {serviceCategories.map((c, i) => (
                      <option key={i} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                    Subcategory Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Holographic VFX or Naked-Eye 3D"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="input"
                  />
                  <span style={{ fontSize: '0.7rem', color: 'var(--iv-text-light)', marginTop: '4px', display: 'block' }}>
                    This subcategory will appear under <strong>{selectedParentCat || 'the chosen category'}</strong> for freelancers when creating gigs.
                  </span>
                </div>
              </div>

              <div className="modalFooter">
                <button type="button" onClick={() => setShowAddSubModal(false)} className="btn btnSecondary">
                  Cancel
                </button>
                <button type="submit" className="btn btnPrimary" disabled={loading}>
                  <GitBranch size={14} /> Save Subcategory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
