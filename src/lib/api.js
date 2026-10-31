// Admin API Client for IlluVision Freelancer Admin Module
// Seamlessly connects to Laravel API with automated token injection and resilient mock fallbacks.

const API_BASE = '/api/freelancing/admin';

// Fallback seed data for instant development & offline testing
export const MOCK_ADMIN_DATA = {
  metrics: {
    total_gmv: 1485400,
    platform_earnings: 148540,
    active_projects: 38,
    in_revision_count: 5,
    dispute_count: 1,
    pending_services: 8,
    pending_portfolios: 4,
    pending_withdrawals: 3,
    total_freelancers: 42,
    total_clients: 128,
  },
  daily_revenue: [
    { date: '10-01', gmv: 34000, commission: 3400 },
    { date: '10-05', gmv: 52000, commission: 5200 },
    { date: '10-10', gmv: 41000, commission: 4100 },
    { date: '10-15', gmv: 68000, commission: 6800 },
    { date: '10-20', gmv: 74000, commission: 7400 },
    { date: '10-25', gmv: 92000, commission: 9200 },
    { date: '10-28', gmv: 85400, commission: 8540 },
  ],
  services: [
    {
      id: 101,
      title: 'I will design aesthetic minimalist posters, typography & concert prints',
      category: 'Poster Design',
      job: 'Poster Designer & Typographer',
      featured_image: '/assets/image/services/poster-design.jpg',
      freelancer_profile: {
        user: { name: 'Aiden Cross', email: 'aiden@illuvision.io', avatar: 'A' },
        rating: 5.0,
        level: 'Level 2 Pro',
      },
      status: 'pending_review',
      submitted_at: '2 hours ago',
      packages: [
        { name: 'Basic', price: 2499, delivery_days: 2, revisions: 3, features: ['1 Poster concept', 'High-res 300 DPI', 'Commercial license'] },
        { name: 'Standard', price: 4999, delivery_days: 3, revisions: 5, features: ['2 Concepts', 'Vector PDF + AI', 'Social media crops'] },
        { name: 'Premium', price: 8999, delivery_days: 4, revisions: 99, features: ['3 Concepts', 'Animated 9:16 teaser', 'Full copyright'] },
      ],
    },
    {
      id: 102,
      title: 'I will create cinematic 3D motion design, logo animation & holographic VFX',
      category: 'Motion Design',
      job: '3D Motion & VFX Artist',
      featured_image: '/assets/image/services/motion-design.jpg',
      freelancer_profile: {
        user: { name: 'Elena Rostova', email: 'elena@rostova.design', avatar: 'E' },
        rating: 4.98,
        level: 'Top Rated Pro',
      },
      status: 'pending_review',
      submitted_at: '4 hours ago',
      packages: [
        { name: 'Basic', price: 4999, delivery_days: 3, revisions: 2, features: ['5s 3D motion loop', '1080p render', 'Audio SFX'] },
        { name: 'Standard', price: 9999, delivery_days: 5, revisions: 4, features: ['15s 4K animation', 'Custom 3D shader', 'Vertical 9:16'] },
        { name: 'Premium', price: 18499, delivery_days: 7, revisions: 99, features: ['30s 4K commercial', 'Octane 60FPS', 'Full C4D source'] },
      ],
    },
    {
      id: 103,
      title: 'I will design luxury brand identity, minimalist modern logo & stationery kit',
      category: 'Graphics & Branding',
      job: 'Brand Identity Designer',
      featured_image: '/assets/image/services/brand-identity-luxury.jpg',
      freelancer_profile: {
        user: { name: 'Marcus Vance', email: 'marcus@vancebrand.com', avatar: 'M' },
        rating: 5.0,
        level: 'Vetted Pro',
      },
      status: 'active',
      submitted_at: 'Yesterday',
      packages: [
        { name: 'Basic', price: 3499, delivery_days: 2, revisions: 3, features: ['2 Logo concepts', 'High-res vector', 'Color palette'] },
        { name: 'Standard', price: 7999, delivery_days: 4, revisions: 6, features: ['4 Concepts', '20-page brand guide', 'Stationery kit'] },
        { name: 'Premium', price: 14999, delivery_days: 6, revisions: 99, features: ['Complete corporate suite', 'Social media kit', '3D gold foil'] },
      ],
    },
    {
      id: 104,
      title: 'I will design high-converting Figma UI/UX for modern web & mobile apps',
      category: 'UI/UX & Web Design',
      job: 'UI/UX & Product Designer',
      featured_image: '/assets/image/services/uiux-design.jpg',
      freelancer_profile: {
        user: { name: 'Sophia Lin', email: 'sophia@linux.design', avatar: 'S' },
        rating: 5.0,
        level: 'Level 2',
      },
      status: 'pending_review',
      submitted_at: '6 hours ago',
      packages: [
        { name: 'Basic', price: 3999, delivery_days: 2, revisions: 3, features: ['Landing page UI', 'Desktop & Mobile', 'Auto-layout Figma'] },
        { name: 'Standard', price: 8999, delivery_days: 5, revisions: 5, features: ['5 Pages UI system', 'Clickable prototype', 'Design tokens'] },
        { name: 'Premium', price: 16999, delivery_days: 8, revisions: 99, features: ['Full app (12+ screens)', 'Atomic component library', 'Dev specs'] },
      ],
    },
    {
      id: 105,
      title: 'I will create Hyper-Realistic 3D Anamorphic Billboard & Corner DOOH Animation',
      category: '3D & DOOH Animation',
      job: '3D DOOH & Billboard Animator',
      featured_image: '/assets/image/services/service-video-editing.jpg',
      freelancer_profile: {
        user: { name: 'Kai Chen', email: 'kai@doohanima.studio', avatar: 'K' },
        rating: 5.0,
        level: 'Top Rated',
      },
      status: 'pending_review',
      submitted_at: '1 day ago',
      packages: [
        { name: 'Basic', price: 4500, delivery_days: 4, revisions: 2, features: ['5s anamorphic loop', 'Single perspective calibration'] },
        { name: 'Standard', price: 9500, delivery_days: 7, revisions: 4, features: ['15s commercial DOOH', 'Raytraced lighting'] },
        { name: 'Premium', price: 19500, delivery_days: 14, revisions: 6, features: ['30s multi-screen suite', 'On-site LED simulation'] },
      ],
    },
  ],
  portfolios: [
    {
      id: 201,
      title: 'Synesthesia 2026 Cyberpunk Electronic Music Festival Poster',
      category: 'Poster Design',
      freelancer: { name: 'Aiden Cross', avatar: 'A', level: 'Level 2' },
      image: '/assets/image/services/poster-design.jpg',
      url: 'https://behance.net/aidencross',
      status: 'pending_review',
      created_at: 'Today, 11:30 AM',
      description: 'Swiss typographical grid layout merged with metallic cyberpunk foil highlights.',
    },
    {
      id: 202,
      title: 'Holographic Automotive 3D Commercial Teaser for NeuraDrive',
      category: 'Motion Design',
      freelancer: { name: 'Elena Rostova', avatar: 'E', level: 'Top Rated' },
      image: '/assets/image/services/motion-design.jpg',
      url: 'https://vimeo.com/elenarostova',
      status: 'pending_review',
      created_at: 'Yesterday',
      description: 'Cinema 4D fluid dynamics with Octane 4K raytraced light reflections on electric carbon fiber.',
    },
    {
      id: 203,
      title: 'Loom & Weave Scandinavian Luxury Architectural Brand Kit',
      category: 'Graphics & Branding',
      freelancer: { name: 'Marcus Vance', avatar: 'M', level: 'Vetted Pro' },
      image: '/assets/image/services/brand-identity-luxury.jpg',
      url: 'https://marcusvance.art',
      status: 'published',
      created_at: 'Oct 24',
      description: 'Architectural monogram and stationery packaging for Nordic interior design studio.',
    },
    {
      id: 204,
      title: 'Fintech Dark Mode Mobile Banking & Crypto Portfolio App UI',
      category: 'UI/UX & Web Design',
      freelancer: { name: 'Sophia Lin', avatar: 'S', level: 'Level 2' },
      image: '/assets/image/services/uiux-design.jpg',
      url: 'https://dribbble.com/sophialin',
      status: 'pending_review',
      created_at: 'Oct 27',
      description: 'Ultra-clean dark glassmorphic design system created in Figma with auto-layout variables.',
    },
  ],
  categories: [
    { id: 1, name: 'Poster & Print Design', slug: 'poster-design', services_count: 18, commission_rate: 10, status: 'active' },
    { id: 2, name: '3D & Motion Graphics', slug: 'motion-design', services_count: 24, commission_rate: 12, status: 'active' },
    { id: 3, name: 'Graphics & Brand Identity', slug: 'graphics-branding', services_count: 19, commission_rate: 10, status: 'active' },
    { id: 4, name: 'UI/UX & Web Design', slug: 'uiux-web-design', services_count: 31, commission_rate: 10, status: 'active' },
    { id: 5, name: '3D & DOOH Animation', slug: 'dooh-animation', services_count: 14, commission_rate: 12, status: 'active' },
    { id: 6, name: 'Short-form Video Editing', slug: 'video-editing', services_count: 22, commission_rate: 10, status: 'active' },
  ],
  category_requests: [
    { id: 1, name: 'Anamorphic Corner Billboard Animation', requested_by: 'Elena Rostova', reason: 'High demand for Times Square & curved LED displays', count: 4, status: 'pending' },
    { id: 2, name: 'Generative AI Sound & Brand Jingles', requested_by: 'Aarav Menon', reason: 'Custom audio lockups for tech startups', count: 2, status: 'pending' },
  ],
  projects: [
    {
      id: 1001,
      reference: 'ORD-9821',
      title: 'Luxury Brand Identity Suite & Guidelines',
      service_title: 'I will design luxury brand identity, minimalist modern logo & stationery kit',
      category: 'Graphics & Branding',
      tier: 'Premium Enterprise',
      gross_amount: 14999,
      platform_fee: 1499.90,
      freelancer_amount: 13499.10,
      client: { name: 'Rajiv Sharma', email: 'rajiv@acmelabs.in', avatar: 'R', company: 'Acme Brand Labs' },
      freelancer: { name: 'Marcus Vance', email: 'marcus@vancebrand.com', avatar: 'M' },
      status: 'revision_requested',
      revision_limit: 5,
      revision_count: 2,
      due_at: 'Tomorrow, 5:00 PM',
      escrow_status: 'Held in Escrow',
      deliverables: [{ id: 1, title: 'Draft v2 (Gold foil mockups)', submitted_at: 'Oct 27, 4:20 PM' }],
    },
    {
      id: 1002,
      reference: 'ORD-9824',
      title: '3D Anamorphic DOOH LED Billboard Video',
      service_title: 'I will create Hyper-Realistic 3D Anamorphic Billboard & Corner DOOH Animation',
      category: '3D & DOOH Animation',
      tier: 'Standard Commercial',
      gross_amount: 9500,
      platform_fee: 1140.00,
      freelancer_amount: 8360.00,
      client: { name: 'Cynthia Morgan', email: 'cynthia@synesthesiamedia.com', avatar: 'C', company: 'Synesthesia Media' },
      freelancer: { name: 'Elena Rostova', email: 'elena@rostova.design', avatar: 'E' },
      status: 'in_progress',
      revision_limit: 4,
      revision_count: 0,
      due_at: 'In 3 Days',
      escrow_status: 'Held in Escrow',
      deliverables: [],
    },
    {
      id: 1003,
      reference: 'ORD-9788',
      title: 'Concert Poster & Swiss Typography Art Suite',
      service_title: 'I will design aesthetic minimalist posters, typography & concert prints',
      category: 'Poster Design',
      tier: 'Standard Poster Suite',
      gross_amount: 4999,
      platform_fee: 499.90,
      freelancer_amount: 4499.10,
      client: { name: 'Devon Vance', email: 'devon@soundfest.org', avatar: 'D', company: 'Echo Music Fest' },
      freelancer: { name: 'Aiden Cross', email: 'aiden@illuvision.io', avatar: 'A' },
      status: 'submitted',
      revision_limit: 5,
      revision_count: 1,
      due_at: 'Awaiting Client Review',
      escrow_status: 'Held in Escrow',
      deliverables: [{ id: 2, title: 'Final 300DPI Vector PDFs & Crops', submitted_at: 'Oct 28, 10:15 AM' }],
    },
    {
      id: 1004,
      reference: 'ORD-9750',
      title: 'Full SaaS Mobile & Web App Figma Redesign',
      service_title: 'I will design high-converting Figma UI/UX for modern web & mobile apps',
      category: 'UI/UX & Web Design',
      tier: 'Premium Complete Suite',
      gross_amount: 16999,
      platform_fee: 1699.90,
      freelancer_amount: 15299.10,
      client: { name: 'Arjun Nambiar', email: 'arjun@zenithpay.com', avatar: 'A', company: 'ZenithPay' },
      freelancer: { name: 'Sophia Lin', email: 'sophia@linux.design', avatar: 'S' },
      status: 'completed',
      revision_limit: 99,
      revision_count: 3,
      due_at: 'Completed on Oct 25',
      escrow_status: 'Released to Freelancer',
      deliverables: [{ id: 3, title: 'Final Figma Link & Assets Pack', submitted_at: 'Oct 25, 2:10 PM' }],
    },
  ],
  withdrawals: [
    {
      id: 301,
      freelancer: { name: 'Aiden Cross', email: 'aiden@illuvision.io', avatar: 'A', level: 'Level 2' },
      amount: 18000,
      wallet_balance: 24500,
      payment_method: 'Bank Transfer (IMPS)',
      account_reference: 'HDFC Bank · A/c ***8912 · IFSC: HDFC0001824',
      status: 'pending',
      requested_at: '4 hours ago',
    },
    {
      id: 302,
      freelancer: { name: 'Elena Rostova', email: 'elena@rostova.design', avatar: 'E', level: 'Top Rated' },
      amount: 42500,
      wallet_balance: 48000,
      payment_method: 'UPI Instant',
      account_reference: 'UPI ID: elenarostova@okhdfc',
      status: 'pending',
      requested_at: '1 day ago',
    },
    {
      id: 303,
      freelancer: { name: 'Marcus Vance', email: 'marcus@vancebrand.com', avatar: 'M', level: 'Vetted Pro' },
      amount: 12000,
      wallet_balance: 15200,
      payment_method: 'Bank Transfer (NEFT)',
      account_reference: 'ICICI Bank · A/c ***4401 · IFSC: ICIC0000441',
      status: 'processed',
      requested_at: 'Oct 26',
      admin_note: 'UTR: ICIC26102894101 · Processed via RazorpayX Payout',
    },
  ],
  commission_settings: {
    commission_rate: 10.0,
    client_service_fee: 3.5,
    fixed_transaction_fee: 0,
    category_overrides: [
      { category: '3D & DOOH Animation', rate: 12.0 },
      { category: '3D & Motion Graphics', rate: 12.0 },
      { category: 'Poster & Print Design', rate: 10.0 },
      { category: 'Graphics & Brand Identity', rate: 10.0 },
      { category: 'UI/UX & Web Design', rate: 10.0 },
    ],
  },
  clients: [
    {
      id: 401,
      name: 'Rajiv Sharma',
      email: 'rajiv@acmelabs.in',
      avatar: 'R',
      company: 'Acme Brand Labs',
      joined_at: 'Aug 2026',
      total_spent: 84500,
      total_orders: 6,
      active_projects: 2,
      active_revisions: 2,
      disputes: 0,
      latest_project: 'Luxury Brand Identity Suite & Guidelines',
    },
    {
      id: 402,
      name: 'Cynthia Morgan',
      email: 'cynthia@synesthesiamedia.com',
      avatar: 'C',
      company: 'Synesthesia Media',
      joined_at: 'Jun 2026',
      total_spent: 142000,
      total_orders: 11,
      active_projects: 1,
      active_revisions: 0,
      disputes: 1,
      latest_project: '3D Anamorphic DOOH LED Billboard Video',
    },
    {
      id: 403,
      name: 'Arjun Nambiar',
      email: 'arjun@zenithpay.com',
      avatar: 'A',
      company: 'ZenithPay Inc.',
      joined_at: 'May 2026',
      total_spent: 189000,
      total_orders: 8,
      active_projects: 0,
      active_revisions: 0,
      disputes: 0,
      latest_project: 'Full SaaS Mobile & Web App Figma Redesign',
    },
    {
      id: 404,
      name: 'Devon Vance',
      email: 'devon@soundfest.org',
      avatar: 'D',
      company: 'Echo Music Fest',
      joined_at: 'Sep 2026',
      total_spent: 32000,
      total_orders: 3,
      active_projects: 1,
      active_revisions: 1,
      disputes: 0,
      latest_project: 'Concert Poster & Swiss Typography Art Suite',
    },
  ],
  reviews: [
    {
      id: 501,
      order_ref: 'ORD-9750',
      rating: 5,
      review: 'Sophia delivered a museum-grade design system in Figma. Developer handoff was flawless and conversion jumped 24%. Recommended without hesitation!',
      client: { name: 'Arjun Nambiar', company: 'ZenithPay' },
      freelancer: { name: 'Sophia Lin', job: 'UI/UX & Product Designer' },
      service_title: 'High-converting Figma UI/UX design',
      created_at: 'Oct 25, 2026',
      status: 'published',
    },
    {
      id: 502,
      order_ref: 'ORD-9610',
      rating: 5,
      review: 'Aiden’s Swiss poster typography is on another level. Exactly the brutalist editorial aesthetic our concert needed.',
      client: { name: 'David K.', company: 'Acoustic Berlin' },
      freelancer: { name: 'Aiden Cross', job: 'Poster Designer' },
      service_title: 'Minimalist posters & typography',
      created_at: 'Oct 21, 2026',
      status: 'published',
    },
    {
      id: 503,
      order_ref: 'ORD-9452',
      rating: 2,
      review: 'Render was delayed by 2 days and the holographic color grading did not match our initial storyboard.',
      client: { name: 'Cynthia Morgan', company: 'Synesthesia Media' },
      freelancer: { name: 'Elena Rostova', job: '3D Motion Designer' },
      service_title: '3D motion design & holographic VFX',
      created_at: 'Oct 18, 2026',
      status: 'flagged',
    },
  ],
};

// Generic fetch wrapper with graceful fallback to mock data
export async function fetchAdmin(endpoint, options = {}) {
  try {
    const token = typeof window !== 'undefined'
      ? (window.localStorage.getItem('illuvision_admin_token') || window.localStorage.getItem('illuvision_token'))
      : null;

    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    // Return payload data directly
    const payload = json.data !== undefined ? json.data : json;
    // If it's a paginated Laravel response with .data array, also provide direct access
    if (payload && payload.data && Array.isArray(payload.data)) {
      return payload.data;
    }
    return payload;
  } catch (err) {
    console.warn(`[AdminAPI] Using fallback for: ${endpoint}`, err.message);
    if (endpoint.includes('/overview')) return MOCK_ADMIN_DATA;
    if (endpoint.includes('/services')) return MOCK_ADMIN_DATA.services;
    if (endpoint.includes('/portfolios')) return MOCK_ADMIN_DATA.portfolios;
    if (endpoint.includes('/categories')) return MOCK_ADMIN_DATA.categories;
    if (endpoint.includes('/projects')) return MOCK_ADMIN_DATA.projects;
    if (endpoint.includes('/withdrawals')) return MOCK_ADMIN_DATA.withdrawals;
    if (endpoint.includes('/commission-settings')) return MOCK_ADMIN_DATA.commission_settings;
    if (endpoint.includes('/clients')) return MOCK_ADMIN_DATA.clients;
    if (endpoint.includes('/reviews')) return MOCK_ADMIN_DATA.reviews;
    return MOCK_ADMIN_DATA;
  }
}

