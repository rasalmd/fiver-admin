import React, { useState } from 'react';
import {
  Percent,
  SlidersHorizontal,
  Calculator,
  Save,
  CheckCircle,
  HelpCircle,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function CommissionView({
  settings = {},
  onSaveSettings,
  loading = false,
}) {
  const [freelancerCommission, setFreelancerCommission] = useState(
    settings.freelancer_commission_pct ?? 10
  );
  const [clientFee, setClientFee] = useState(
    settings.client_service_fee_pct ?? 3.5
  );
  const [minEscrow, setMinEscrow] = useState(
    settings.min_escrow_deposit ?? 500
  );

  // Live Simulator state
  const [sampleProjectAmount, setSampleProjectAmount] = useState(10000);
  const [savedAlert, setSavedAlert] = useState(false);

  // Calculated values
  const clientChargedFee = (sampleProjectAmount * clientFee) / 100;
  const totalClientPays = sampleProjectAmount + clientChargedFee;
  const freelancerCommissionDeducted = (sampleProjectAmount * freelancerCommission) / 100;
  const freelancerNetTakehome = sampleProjectAmount - freelancerCommissionDeducted;
  const platformTotalRevenue = clientChargedFee + freelancerCommissionDeducted;

  const handleSave = () => {
    onSaveSettings({
      freelancer_commission_pct: Number(freelancerCommission),
      client_service_fee_pct: Number(clientFee),
      min_escrow_deposit: Number(minEscrow),
    });
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
            Platform Commission & Fee Configuration
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--iv-text-muted)' }}>
            Configure automatic deduction rules applied to escrow releases and checkout transactions
          </p>
        </div>

        <button onClick={handleSave} className="btn btnPrimary" disabled={loading}>
          <Save size={16} /> Save Commission Rules
        </button>
      </div>

      {savedAlert && (
        <div style={{ padding: '12px 18px', background: '#ecfdf5', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 'var(--radius-md)', color: '#059669', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} /> Platform commission rates saved & applied across live escrow engine!
        </div>
      )}

      {/* Main Configuration Grid: Sliders + Interactive Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        {/* Sliders Card */}
        <div className="card">
          <div className="cardBody" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
              Core Fee Parameters
            </h3>

            {/* Slider 1: Freelancer Platform Commission */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                    Freelancer Commission Rate
                  </label>
                  <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-muted)' }}>
                    Deducted from project payment when escrow is released to freelancer wallet
                  </div>
                </div>
                <span className="badge badge-primary" style={{ fontSize: '0.92rem', padding: '4px 10px' }}>
                  {freelancerCommission}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={freelancerCommission}
                onChange={(e) => setFreelancerCommission(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--iv-primary)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--iv-text-light)', marginTop: '4px' }}>
                <span>0% (Free)</span>
                <span>10% (Recommended)</span>
                <span>25% (Max)</span>
              </div>
            </div>

            {/* Slider 2: Client Service Fee */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                    Client Processing & Escrow Fee
                  </label>
                  <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-muted)' }}>
                    Added on top of gig order total at checkout to cover payment processing & dispute guarantees
                  </div>
                </div>
                <span className="badge" style={{ background: '#ecfdf5', color: '#047857', fontSize: '0.92rem', padding: '4px 10px', border: '1px solid rgba(4,120,87,0.2)' }}>
                  {clientFee}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={clientFee}
                onChange={(e) => setClientFee(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#059669' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--iv-text-light)', marginTop: '4px' }}>
                <span>0% (No Surcharge)</span>
                <span>3.5% (Standard)</span>
                <span>10%</span>
              </div>
            </div>

            {/* Minimum Escrow Deposit */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--iv-text-main)', marginBottom: '6px' }}>
                Minimum Allowed Project Escrow Floor (₹)
              </label>
              <input
                type="number"
                value={minEscrow}
                onChange={(e) => setMinEscrow(e.target.value)}
                className="input"
                style={{ width: '200px' }}
              />
            </div>
          </div>
        </div>

        {/* Live Interactive Fee Simulator */}
        <div className="card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
          <div className="cardBody">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Calculator size={18} color="var(--iv-primary)" />
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--iv-text-main)' }}>
                Live Settlement Simulator
              </h3>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--iv-text-muted)', marginBottom: '6px' }}>
                TEST PROJECT ORDER AMOUNT (₹)
              </label>
              <input
                type="number"
                step="500"
                value={sampleProjectAmount}
                onChange={(e) => setSampleProjectAmount(Math.max(100, Number(e.target.value)))}
                className="input"
                style={{ fontSize: '1.1rem', fontWeight: 800 }}
              />
            </div>

            {/* Breakdown Stack */}
            <div style={{ background: '#ffffff', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--iv-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--iv-text-muted)' }}>Base Order Value</span>
                <span style={{ fontWeight: 700 }}>₹{sampleProjectAmount.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: '#047857' }}>+ Client Fee ({clientFee}%)</span>
                <span style={{ fontWeight: 700, color: '#047857' }}>+₹{clientChargedFee.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, borderTop: '1px solid var(--iv-border-subtle)', paddingTop: '8px' }}>
                <span>Total Client Pays</span>
                <span>₹{totalClientPays.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--status-rejected)' }}>
                <span>- Freelancer Commission ({freelancerCommission}%)</span>
                <span style={{ fontWeight: 700 }}>-₹{freelancerCommissionDeducted.toLocaleString('en-IN')}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 800, borderTop: '1px solid var(--iv-border-subtle)', paddingTop: '8px', color: '#059669' }}>
                <span>Freelancer Take-Home</span>
                <span>₹{freelancerNetTakehome.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Platform Gross Earnings Result Box */}
            <div style={{ marginTop: '16px', background: 'var(--iv-primary-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--iv-primary-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--iv-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Platform Total Net Retained
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--iv-text-muted)' }}>
                  Commission + Processing fee
                </div>
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--iv-primary)' }}>
                ₹{platformTotalRevenue.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
