import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('analytics');

    const budgetStats = {
        totalBudget: 50000,
        totalSpent: 12450,
        actualSpent: 10200,
        committedAmount: 2250,
        projectedSpending: 57500, // Simulated projection
    };

    const categorySpending = [
        { category: 'Travel', amount: 3500, color: '#3B70F7' },
        { category: 'Food', amount: 1200, color: '#4CAF50' },
        { category: 'Equipment', amount: 5800, color: '#FF9800' },
        { category: 'Misc', amount: 1950, color: '#9C27B0' },
    ];

    const receipts = [
        {
            id: 1,
            user: 'John Doe',
            userAmount: '$150',
            ocrAmount: '$150',
            userDate: '2024-03-20',
            ocrDate: '2024-03-20',
            category: 'Travel',
            status: 'Pending'
        },
        {
            id: 2,
            user: 'Jane Smith',
            userAmount: '$45',
            ocrAmount: '$48',
            userDate: '2024-03-21',
            ocrDate: '2024-03-21',
            category: 'Food',
            status: 'Pending'
        },
        {
            id: 3,
            user: 'Mike Ross',
            userAmount: '$1,200',
            ocrAmount: '$1,200',
            userDate: '2024-03-22',
            ocrDate: '2024-03-23',
            category: 'Equipment',
            status: 'Pending'
        },
    ];

    const auditLogs = [
        { id: 1, action: 'Admin approved receipt #452', time: '2 mins ago', user: 'Admin' },
        { id: 2, action: 'User John uploaded receipt', time: '15 mins ago', user: 'System' },
        { id: 3, action: 'Admin rejected receipt #451', time: '1 hour ago', user: 'Admin' },
        { id: 4, action: 'Budget limit increased for Tech Club', time: '3 hours ago', user: 'Root' },
    ];

    const getOverrunPercentage = () => {
        const overrun = budgetStats.projectedSpending - budgetStats.totalBudget;
        return ((overrun / budgetStats.totalBudget) * 100).toFixed(1);
    };

    const isOverspending = budgetStats.projectedSpending > budgetStats.totalBudget;

    return (
        <div className="admin-dashboard">
            <header className="admin-topbar">
                <div className="topbar-brand" onClick={() => onNavigate('home')}>
                    <div className="logo-box"></div>
                    <h2>SPENDWISE</h2>
                </div>
                <div className="user-profile">
                    <span>Admin User</span>
                    <div className="avatar"></div>
                </div>
            </header>

            <div className="admin-body">
                <div className="sidebar">
                    <nav className="sidebar-nav">
                    <button
                        className={activeTab === 'analytics' ? 'active' : ''}
                        onClick={() => setActiveTab('analytics')}
                    >
                        📊 Analytics
                    </button>
                    <button
                        className={activeTab === 'receipts' ? 'active' : ''}
                        onClick={() => setActiveTab('receipts')}
                    >
                        🧾 Receipts
                    </button>
                    <button
                        className={activeTab === 'audit' ? 'active' : ''}
                        onClick={() => setActiveTab('audit')}
                    >
                        📜 Audit Logs
                    </button>
                </nav>
                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={() => onNavigate('home')}>Logout</button>
                </div>
            </div>

            <main className="main-content">
                <header className="dashboard-header">
                    <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Dashboard</h1>
                </header>

                {activeTab === 'analytics' && isOverspending && (
                    <div className="alert-banner warning">
                        <span className="alert-icon">⚠️</span>
                        <p><strong>Predictive Alert:</strong> Projected budget overrun by {getOverrunPercentage()}% (${(budgetStats.projectedSpending - budgetStats.totalBudget).toLocaleString()}). Please review recent commitments.</p>
                    </div>
                )}

                <section className="dashboard-body">
                    {activeTab === 'analytics' && (
                        <div className="analytics-view">
                            <div className="stats-grid">
                                <div className="stat-card primary">
                                    <div className="stat-info">
                                        <p>Total Budget</p>
                                        <h3>${budgetStats.totalBudget.toLocaleString()}</h3>
                                    </div>
                                    <span className="stat-icon">💰</span>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-info">
                                        <p>Total Spent (Usage)</p>
                                        <h3>${budgetStats.totalSpent.toLocaleString()}</h3>
                                    </div>
                                    <span className="stat-icon">📉</span>
                                </div>
                                <div className="stat-card highlight">
                                    <div className="stat-info">
                                        <p>Actual Spent</p>
                                        <h3>${budgetStats.actualSpent.toLocaleString()}</h3>
                                    </div>
                                    <span className="stat-icon">✅</span>
                                </div>
                                <div className="stat-card secondary">
                                    <div className="stat-info">
                                        <p>Committed Amount</p>
                                        <h3>${budgetStats.committedAmount.toLocaleString()}</h3>
                                    </div>
                                    <span className="stat-icon">🕒</span>
                                </div>
                            </div>

                            <div className="distribution-card">
                                <h3>Category-wise Spending</h3>
                                <div className="chart-container">
                                    <div className="category-chart">
                                        {categorySpending.map((item, index) => (
                                            <div key={index} className="chart-bar-group">
                                                <div
                                                    className="chart-bar"
                                                    style={{
                                                        height: `${(item.amount / 6000) * 100}%`,
                                                        backgroundColor: item.color
                                                    }}
                                                >
                                                    <span className="bar-tooltip">${item.amount}</span>
                                                </div>
                                                <span className="bar-label">{item.category}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'receipts' && (
                        <div className="receipts-view">
                            <table className="dashboard-table">
                                <thead>
                                    <tr className="grouped-header-row">
                                        <th rowSpan="2">User</th>
                                        <th colSpan="2" className="grouped-header">Amount Verification</th>
                                        <th colSpan="2" className="grouped-header">Date Verification</th>
                                        <th rowSpan="2">Category</th>
                                        <th rowSpan="2">Status</th>
                                        <th rowSpan="2">Actions</th>
                                    </tr>
                                    <tr className="sub-header-row">
                                        <th>User Entry</th>
                                        <th>OCR</th>
                                        <th>User Entry</th>
                                        <th>OCR</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipts.map(receipt => (
                                        <tr key={receipt.id}>
                                            <td>{receipt.user}</td>
                                            <td>{receipt.userAmount}</td>
                                            <td className={receipt.userAmount === receipt.ocrAmount ? 'text-match' : 'text-mismatch'}>
                                                {receipt.ocrAmount}
                                            </td>
                                            <td>{receipt.userDate}</td>
                                            <td className={receipt.userDate === receipt.ocrDate ? 'text-match' : 'text-mismatch'}>
                                                {receipt.ocrDate}
                                            </td>
                                            <td>{receipt.category}</td>
                                            <td><span className="status-badge pending">{receipt.status}</span></td>
                                            <td>
                                                <button className="action-btn approve">Check</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'audit' && (
                        <div className="audit-view">
                            <ul className="audit-list">
                                {auditLogs.map(log => (
                                    <li key={log.id} className="audit-item">
                                        <div className="log-icon">🔔</div>
                                        <div className="log-details">
                                            <p><strong>{log.action}</strong></p>
                                            <span className="log-meta">{log.user} • {log.time}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>
            </main>
            </div>
        </div>
    );
}

export default AdminDashboard;
