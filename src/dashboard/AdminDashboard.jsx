import React, { useState, useEffect, useCallback } from 'react';
import Logo from '../assets/Aimsa.png';
import './AdminDashboard.css';
import '../components/user_dashboard/UserDashboard.css';
import '../components/user_dashboard/Sidebar.css';
import '../components/user_dashboard/DashboardNavbar.css';
import AdminAnalytics from './AdminAnalytics';
import AdminEvents from './AdminEvents';

const API = 'http://localhost:5000';

// Pick a deterministic avatar colour from the submitter's name
const avatarColor = (name = '') => {
    const colors = ['#7C5CBF', '#3B70F7', '#4CAF50', '#FF9800', '#E91E63', '#00BCD4'];
    let hash = 0;
    for (let c of name) hash = c.charCodeAt(0) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
};

const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'XX';

const statusClass = (status = '') => {
    switch (status.toLowerCase()) {
        case 'approved': return 'status-approved';
        case 'rejected': return 'status-rejected';
        case 'flagged':  return 'status-flagged';
        default:         return 'status-pending';
    }
};

const statusLabel = (status = '') =>
    status.charAt(0).toUpperCase() + status.slice(1);

function AdminDashboard({ onNavigate }) {
    const [activeNav, setActiveNav] = useState('queue');
    const [expenses, setExpenses] = useState([]);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [comment, setComment] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // ── Fetch expenses from backend ──────────────────────────────────────────
    const fetchExpenses = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/expenses`);
            const data = await res.json();
            setExpenses(data);
            // Keep the selected panel in sync
            setSelectedExpense(prev =>
                prev ? (data.find(e => e._id === prev._id) || data[0] || null) : (data[0] || null)
            );
        } catch (err) {
            console.error('Failed to fetch expenses:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

    // ── Update status via PUT ─────────────────────────────────────────────────
    const updateStatus = async (id, newStatus) => {
        try {
            await fetch(`${API}/api/expenses/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            await fetchExpenses();   // refresh queue after action
            setComment('');
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        }
    };

    // ── Filtered list ────────────────────────────────────────────────────────
    const visibleExpenses = statusFilter === 'all'
        ? expenses
        : expenses.filter(e => e.status.toLowerCase() === statusFilter);

    const pendingCount = expenses.filter(e => e.status.toLowerCase() === 'pending').length;

    return (
        <div className="dashboard" style={{ height: '100vh', overflow: 'hidden' }}>

            {/* ── SIDEBAR ─────────────────────────────────────────────────── */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Menu</h2>
                    <button className="closeBtn" onClick={() => setSidebarOpen(false)}>✕</button>
                </div>
                <ul>
                    <li className={activeNav === 'queue' ? 'active' : ''}
                        onClick={() => { setActiveNav('queue'); setSidebarOpen(false); }}>
                        <span>📋</span> Expense Queue
                        {pendingCount > 0 && (
                            <span style={{
                                marginLeft: 'auto', background: '#3B70F7', color: '#fff',
                                borderRadius: '12px', padding: '2px 8px', fontSize: '11px', fontWeight: 700
                            }}>{pendingCount}</span>
                        )}
                    </li>
                    <li className={activeNav === 'analytics' ? 'active' : ''}
                        onClick={() => { setActiveNav('analytics'); setSidebarOpen(false); }}>
                        <span>📈</span> Analytics
                    </li>
                    <li className={activeNav === 'events' ? 'active' : ''}
                        onClick={() => { setActiveNav('events'); setSidebarOpen(false); }}>
                        <span>📅</span> Event Details
                    </li>
                    <li className={activeNav === 'settings' ? 'active' : ''}
                        onClick={() => { setActiveNav('settings'); setSidebarOpen(false); }}>
                        <span>⚙️</span> Settings
                    </li>
                    <li className="logout-item" onClick={() => onNavigate('home')}>
                        <span>🚪</span> Log Out
                    </li>
                </ul>
            </div>

            {/* ── MAIN PANEL ──────────────────────────────────────────────── */}
            <div className="dashboardRightPanel">

                {/* HEADER */}
                <nav className="dashboardNavbar">
                    <button className="menuBtn" onClick={() => setSidebarOpen(true)}>☰</button>

                    <div className="topbar-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={Logo} alt="SpendWise Logo" style={{ height: '36px', width: 'auto' }} />
                        <h2 className="brand-text-light" style={{ fontSize: '18px', margin: 0, textTransform: 'uppercase' }}>
                            SPENDWISE
                        </h2>
                    </div>

                    <nav className="navLinks">
                        <button
                            style={{ backgroundColor: activeNav === 'queue' ? 'var(--secondary-blue)' : '', border: activeNav === 'queue' ? '1px solid white' : '' }}
                            onClick={() => setActiveNav('queue')}>Queue</button>
                        <button
                            style={{ backgroundColor: activeNav === 'analytics' ? 'var(--secondary-blue)' : '', border: activeNav === 'analytics' ? '1px solid white' : '' }}
                            onClick={() => setActiveNav('analytics')}>Analytics</button>
                        <button
                            style={{ backgroundColor: activeNav === 'events' ? 'var(--secondary-blue)' : '', border: activeNav === 'events' ? '1px solid white' : '' }}
                            onClick={() => setActiveNav('events')}>Events</button>
                    </nav>

                    <div className="topbar-right">
                        <div className="topbar-search">
                            <span className="search-icon-inner">🔍</span>
                            <input type="text" placeholder="Search transactions..." />
                        </div>
                        <button className="topbar-icon-btn">🔔</button>
                        <div className="topbar-avatar">AD</div>
                    </div>
                </nav>

                <main className="dashboardMain" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                    {/* Analytics */}
                    {activeNav === 'analytics' && <AdminAnalytics />}

                    {/* Events */}
                    {activeNav === 'events' && <AdminEvents />}

                    {/* Queue */}
                    {activeNav === 'queue' && (
                        <div className="admin-content-area" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                            {/* LEFT: Expense list */}
                            <div className="queue-panel">
                                <div className="queue-header">
                                    <h2>Review Queue</h2>
                                    <p className="queue-subtitle">
                                        {loading ? 'Loading…' : `${pendingCount} report${pendingCount !== 1 ? 's' : ''} pending verification`}
                                    </p>
                                </div>

                                {/* Status filter pills */}
                                <div className="queue-filters">
                                    <div className="filter-group">
                                        <span className="filter-label">STATUS</span>
                                        {['all', 'pending', 'approved', 'rejected'].map(f => (
                                            <button
                                                key={f}
                                                className={statusFilter === f ? 'filter-pill active' : 'filter-pill'}
                                                onClick={() => setStatusFilter(f)}
                                            >
                                                {f.charAt(0).toUpperCase() + f.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className="filter-pill"
                                        style={{ marginLeft: 'auto' }}
                                        onClick={fetchExpenses}
                                        title="Refresh queue"
                                    >🔄 Refresh</button>
                                </div>

                                <div className="expense-list">
                                    {visibleExpenses.length === 0 && (
                                        <div style={{ padding: '40px 24px', textAlign: 'center', color: '#a3abc9' }}>
                                            {loading ? 'Loading expenses…' : 'No expenses found.'}
                                        </div>
                                    )}
                                    {visibleExpenses.map(exp => (
                                        <div
                                            key={exp._id}
                                            className={`expense-card ${selectedExpense?._id === exp._id ? 'selected' : ''}`}
                                            onClick={() => setSelectedExpense(exp)}
                                        >
                                            <div className="expense-avatar" style={{ background: avatarColor(exp.submittedBy || 'Unknown User') }}>
                                                {initials(exp.submittedBy || 'Unknown User')}
                                            </div>
                                            <div className="expense-info">
                                                <p className="expense-name">{exp.submittedBy || 'Unknown User'}</p>
                                                <p className="expense-date">{exp.event} • {exp.date}</p>
                                            </div>
                                            <div className="expense-right">
                                                <p className="expense-amount">₹{Number(exp.amount).toLocaleString('en-IN')}</p>
                                                <span className={`status-badge ${statusClass(exp.status)}`}>
                                                    {statusLabel(exp.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: Detail / Inspector panel */}
                            {selectedExpense && (
                                <div className="detail-panel">
                                    {/* Header */}
                                    <div className="inspector-header">
                                        <div className="inspector-header-row">
                                            <div className="ih-col">
                                                <span className="ih-label">SUBMITTED BY</span>
                                                <span className="ih-value">{selectedExpense.submittedBy || 'Unknown User'}</span>
                                            </div>
                                            <div className="ih-col">
                                                <span className="ih-label">CATEGORY</span>
                                                <span className="ih-value">{selectedExpense.category}</span>
                                            </div>
                                            <div className="ih-col">
                                                <span className="ih-label">DATE</span>
                                                <span className="ih-value">{selectedExpense.date}</span>
                                            </div>
                                        </div>
                                        <div className="ih-row-full">
                                            <span className="ih-label">EVENT / PURPOSE</span>
                                            <span className="ih-value">{selectedExpense.event}</span>
                                        </div>
                                        {selectedExpense.description && (
                                            <div className="ih-row-full">
                                                <span className="ih-label">DESCRIPTION</span>
                                                <span className="ih-value" style={{ fontSize: '13px' }}>
                                                    {selectedExpense.description}
                                                </span>
                                            </div>
                                        )}
                                        <button className="close-btn" onClick={() => setSelectedExpense(null)}>✕</button>
                                    </div>

                                    {/* Amount summary */}
                                    <div className="ocr-match-card" style={{ marginTop: '8px' }}>
                                        <div className="om-half">
                                            <span className="om-label">CLAIMED AMOUNT</span>
                                            <span className="om-val" style={{ fontSize: '22px', color: '#1d2b3a' }}>
                                                ₹{Number(selectedExpense.amount).toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                        <div className="om-half" style={{ textAlign: 'right' }}>
                                            <span className="om-label">CURRENT STATUS</span>
                                            <span className={`status-badge ${statusClass(selectedExpense.status)}`}
                                                style={{ fontSize: '13px', padding: '5px 14px' }}>
                                                {statusLabel(selectedExpense.status)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Receipt preview */}
                                    {selectedExpense.billFile && (
                                        <div className="ocr-engine-section">
                                            <div className="ocr-engine-header">
                                                <div className="oe-title-group">
                                                    <span className="oe-icon">🧾</span>
                                                    <span className="oe-title">Uploaded Receipt</span>
                                                </div>
                                            </div>
                                            {selectedExpense.billFile.startsWith('data:image') ? (
                                                <img
                                                    src={selectedExpense.billFile}
                                                    alt="receipt"
                                                    style={{ width: '100%', borderRadius: '8px', border: '1px solid #e8edf5', maxHeight: '220px', objectFit: 'contain' }}
                                                />
                                            ) : (
                                                <a href={selectedExpense.billFile} target="_blank" rel="noreferrer"
                                                    style={{ color: '#3B70F7', fontSize: '13px', fontWeight: 600 }}>
                                                    📄 View Uploaded PDF
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Reviewer action */}
                                    <div className="review-action-section">
                                        <p className="section-label">REVIEWER COMMENTS</p>
                                        <textarea
                                            className="comment-box"
                                            placeholder="Add your comments here..."
                                            value={comment}
                                            onChange={e => setComment(e.target.value)}
                                        />
                                        <div className="action-row">
                                            <button
                                                className="action-approve-btn"
                                                onClick={() => updateStatus(selectedExpense._id, 'approved')}
                                                disabled={selectedExpense.status === 'approved'}
                                            >APPROVE</button>
                                            <button
                                                className="action-reject-btn"
                                                onClick={() => updateStatus(selectedExpense._id, 'rejected')}
                                                disabled={selectedExpense.status === 'rejected'}
                                            >REJECT</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
