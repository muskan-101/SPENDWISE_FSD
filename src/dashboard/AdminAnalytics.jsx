import React, { useState, useEffect } from 'react';
import './AdminAnalytics.css';

const API = 'http://localhost:5000';
const COLORS = ['#3B70F7', '#4CAF50', '#FF9800', '#9C27B0', '#e74c3c', '#00BCD4'];

/* Build the conic-gradient string for the donut from categoryData */
function conicGradient(data) {
    if (!data || data.length === 0) return 'conic-gradient(#e8edf5 0% 100%)';
    let segments = [];
    let cumulative = 0;
    for (const d of data) {
        segments.push(`${d.color} ${cumulative}% ${cumulative + d.pct}%`);
        cumulative += d.pct;
    }
    return `conic-gradient(${segments.join(', ')})`;
}

function AdminAnalytics() {
    const [stats, setStats] = useState({
        overall: { totalSpending: 0, highestExpense: 0, transactions: 0, averageExpense: 0 },
        breakdown: [],
        spenders: [],
        status: []
    });
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('None');

    useEffect(() => {
        // Fetch all events for the dropdown
        fetch(`${API}/api/events`)
            .then(res => res.json())
            .then(data => {
                setEvents(data);
            })
            .catch(err => console.error("Failed to fetch events:", err));
    }, []);

    useEffect(() => {
        if (selectedEvent === 'None') return;

        setLoading(true);
        const url = `${API}/api/expenses/stats?event=${encodeURIComponent(selectedEvent)}`;
            
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setStats({
                    overall: data.overall || { totalSpending: 0, highestExpense: 0, transactions: 0, averageExpense: 0 },
                    breakdown: data.breakdown || [],
                    spenders: data.spenders || [],
                    status: data.status || []
                });
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch analytics:", err);
                setLoading(false);
            });
    }, [selectedEvent]);

    const activeEventObj = events.find(e => e.name === selectedEvent);
    const totalBudget = activeEventObj ? activeEventObj.budget : 0;

    const totalSpent = stats.overall.totalSpending || 0;

    const categoryData = stats.breakdown.map((b, i) => ({
        label: b.name,
        pct: totalSpent > 0 ? Math.round((b.amount / totalSpent) * 100) : 0,
        color: COLORS[i % COLORS.length]
    }));

    const budgetBars = stats.breakdown.map((b, i) => {
        let maxBudget = totalBudget > 0 ? totalBudget : 5000;
        let pct = Math.min(100, Math.round((b.amount / maxBudget) * 100));
        return {
            label: b.name.toUpperCase(),
            amount: `₹${b.amount.toLocaleString('en-IN')}`,
            pct,
            color: COLORS[i % COLORS.length],
            tag: b.amount > maxBudget ? 'OVERRUN' : null
        };
    });

    let approvedAmount = 0;
    let pendingAmount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let pendingCount = 0;

    stats.status.forEach(s => {
        if (s.status.toLowerCase() === 'approved') { approvedCount = s.count; approvedAmount = s.amount || 0; }
        if (s.status.toLowerCase() === 'rejected') { rejectedCount = s.count; }
        if (s.status.toLowerCase() === 'pending') { pendingCount = s.count; pendingAmount = s.amount || 0; }
    });

    const totalTransactions = stats.overall.transactions || 0;
    const funnelData = [
        { label: 'SUBMITTED', value: totalTransactions, pct: 100, color: '#a3abc9' },
        { label: 'REVIEWED', value: approvedCount + rejectedCount, pct: totalTransactions ? Math.round(((approvedCount + rejectedCount) / totalTransactions) * 100) : 0, color: '#3B70F7' },
        { label: 'APPROVED', value: approvedCount, pct: totalTransactions ? Math.round((approvedCount / totalTransactions) * 100) : 0, color: '#4CAF50' },
        { label: 'REJECTED', value: rejectedCount, pct: totalTransactions ? Math.round((rejectedCount / totalTransactions) * 100) : 0, color: '#e74c3c' },
    ];

    const topSpenderAmount = stats.spenders.length > 0 ? stats.spenders[0].amount : 1;
    const spendersList = stats.spenders.map((s, i) => {
        const initials = ((s.name || 'UU').split(' ').map(n => n[0]).join('')).substring(0, 2).toUpperCase() || 'XX';
        return {
            initials,
            color: COLORS[i % COLORS.length],
            name: s.name,
            dept: 'Student',
            amount: `₹${s.amount.toLocaleString('en-IN')}`,
            pct: topSpenderAmount > 0 ? Math.round((s.amount / topSpenderAmount) * 100) : 0
        };
    });

    const budgetUtilizationPct = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

    return (
        <div className="an-view">

            {/* ── Hero Banner ── */}
            <div className="an-hero" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="an-hero-content">
                    <h1 style={{ margin: 0 }}>{selectedEvent === 'None' ? 'Analytics Dashboard' : selectedEvent + ' Analytics'}</h1>
                </div>

                <div style={{ position: 'relative', zIndex: 10, flexShrink: 0 }}>
                    <select 
                        value={selectedEvent} 
                        onChange={e => setSelectedEvent(e.target.value)}
                        style={{
                            padding: '10px 16px',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            backgroundColor: 'white',
                            color: '#1d2b3a',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            outline: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                         }}
                    >
                        <option value="None">None</option>
                        {events.map(evt => (
                            <option key={evt._id} value={evt.name}>{evt.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedEvent !== 'None' && (
                loading ? (
                    <div style={{ padding: '80px 20px', textAlign: 'center', color: '#64748b', fontSize: '16px', fontWeight: 600 }}>
                        ⏳ Loading latest data...
                    </div>
                ) : (
                <>
                    {/* ── KPI Cards ── */}
            <div className="an-kpi-row">
                <div className="an-kpi-card">
                    <div className="an-kpi-top">
                        <span className="an-kpi-label">Total Budget</span>
                        <span className="an-kpi-icon" style={{ background: '#eef2ff', color: '#3B70F7' }}></span>
                    </div>
                    <p className="an-kpi-value">₹{Number(totalBudget).toLocaleString('en-IN')}</p>
                </div>
                <div className="an-kpi-card">
                    <div className="an-kpi-top">
                        <span className="an-kpi-label">Total Spent</span>
                        <span className="an-kpi-icon" style={{ background: '#fff4e5', color: '#FF9800' }}></span>
                    </div>
                    <p className="an-kpi-value">₹{totalSpent.toLocaleString('en-IN')}</p>
                </div>
                <div className="an-kpi-card">
                    <div className="an-kpi-top">
                        <span className="an-kpi-label">Actual Approved</span>
                        <span className="an-kpi-icon" style={{ background: '#eafaf1', color: '#4CAF50' }}></span>
                    </div>
                    <p className="an-kpi-value">₹{approvedAmount.toLocaleString('en-IN')}</p>
                </div>
                <div className="an-kpi-card">
                    <div className="an-kpi-top">
                        <span className="an-kpi-label">Pending</span>
                        <span className="an-kpi-icon" style={{ background: '#fff8e1', color: '#ffa800' }}></span>
                    </div>
                    <p className="an-kpi-value">₹{pendingAmount.toLocaleString('en-IN')}</p>
                </div>
            </div>

            {/* ── Mid Row: Donut | Budget Bars | Funnel ── */}
            <div className="an-mid-row">

                {/* Spend by Category */}
                <div className="an-card an-donut-card">
                    <p className="an-card-title">Spend by Category</p>
                    <div className="an-donut-wrap">
                        <div
                            className="an-donut-ring"
                            style={{ background: conicGradient(categoryData) }}
                        >
                            <div className="an-donut-hole">
                                <span className="an-donut-sublabel">TOTAL</span>
                                <span className="an-donut-value">₹{(totalSpent / 1000).toFixed(1)}K</span>
                            </div>
                        </div>
                    </div>
                    <div className="an-donut-legend">
                        {categoryData.map((c, i) => (
                            <span key={i} className="an-legend-item">
                                <span className="an-dot" style={{ background: c.color }}></span>
                                {c.label} {c.pct}%
                            </span>
                        ))}
                    </div>
                </div>

                {/* Budget Utilisation */}
                <div className="an-card an-budget-card">
                    <p className="an-card-title">Budget Utilisation</p>
                    <p className="an-budget-pct">{budgetUtilizationPct}%</p>
                    <div className="an-budget-outer-bar">
                        <div className="an-budget-inner-bar" style={{ width: `${budgetUtilizationPct}%` }} />
                    </div>
                    <div className="an-budget-bars">
                        {budgetBars.map((b, i) => (
                            <div key={i} className="an-bbr">
                                <div className="an-bbr-top">
                                    <span className="an-bbr-label">
                                        {b.label}
                                        {b.tag && <span className="an-overrun-tag">{b.tag}</span>}
                                    </span>
                                    <span className="an-bbr-amount">{b.amount}</span>
                                </div>
                                <div className="an-bbr-track">
                                    <div className="an-bbr-fill" style={{ width: `${b.pct}%`, background: b.color }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Approval Funnel */}
                <div className="an-card an-funnel-card">
                    <p className="an-card-title">Approval Funnel</p>
                    <div className="an-funnel-rows">
                        {funnelData.map((f, i) => (
                            <div key={i} className="an-funnel-row">
                                <span className="an-funnel-label">{f.label}</span>
                                <div className="an-funnel-track">
                                    <div className="an-funnel-fill" style={{ width: `${f.pct}%`, background: f.color }} />
                                </div>
                                <span className="an-funnel-val">{f.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="an-funnel-stats">
                        <div className="an-funnel-stat">
                            <p className="an-fs-value red">{totalTransactions ? Math.round((rejectedCount / totalTransactions) * 100) : 0}%</p>
                            <p className="an-fs-label">REJECTION RATE</p>
                        </div>
                        <div className="an-funnel-stat">
                            <p className="an-fs-value blue">3.2d</p>
                            <p className="an-fs-label">AVG CYCLE TIME</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Row: Top Spenders | OCR Health ── */}
            <div className="an-bottom-row">

                {/* Top Spenders */}
                <div className="an-card an-spenders-card">
                    <div className="an-spenders-header">
                        <p className="an-card-title">Top Spenders</p>
                        <button className="an-export-btn">Export Report</button>
                    </div>
                    <div className="an-spender-list">
                        {spendersList.map((s, i) => (
                            <div key={i} className="an-spender-row">
                                <div className="an-spender-avatar" style={{ background: s.color }}>{s.initials}</div>
                                <div className="an-spender-info">
                                    <div className="an-spender-top">
                                        <span className="an-spender-name">{s.name}</span>
                                        <span className="an-spender-amount">{s.amount}</span>
                                    </div>
                                    <p className="an-spender-dept">{s.dept}</p>
                                    <div className="an-spender-track">
                                        <div className="an-spender-fill" style={{ width: `${s.pct}%`, background: s.color }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="an-view-all-btn">View all students</button>
                </div>
            </div>
            </>
            ))}

            <div className="an-footer">
                Built by Muskan Thakur & Arya Dhumal | SY CSE AIML
            </div>
        </div>
    );
}

export default AdminAnalytics;
