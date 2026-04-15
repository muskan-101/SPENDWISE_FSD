import React, { useState, useEffect } from 'react';
import './AdminAnalytics.css'; // Reusing styles from analytics 

const API = 'http://localhost:5000';

function AdminEvents() {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [eventName, setEventName] = useState('');
    const [totalBudget, setTotalBudget] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/events`);
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleAddEvent = async () => {
        if (!eventName.trim() || !totalBudget) {
            alert('Please enter both the event name and total budget.');
            return;
        }

        try {
            const res = await fetch(`${API}/api/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: eventName, budget: Number(totalBudget) })
            });

            if (res.ok) {
                alert("Event Created Successfully!");
                setEventName('');
                setTotalBudget('');
                setShowForm(false);
                fetchEvents();
            } else {
                let errMsg = "Unknown error";
                try {
                    const errData = await res.json();
                    errMsg = errData.error || errData.message || errMsg;
                } catch {
                    errMsg = "Server returned an invalid response (Are you sure the backend was restarted?)";
                }
                alert(`Error: ${errMsg}`);
            }
        } catch (err) {
            console.error(err);
            alert("Error connecting to server. Please ensure your backend is running!");
        }
    };

    if (showForm) {
        return (
            <div className="an-view" style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ margin: '0 0 20px', color: '#1d2b3a', fontSize: '20px' }}>Dashboard Setup (New Event)</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Event Name</label>
                            <input 
                                type="text" 
                                placeholder="E.g. Techfest 2024" 
                                value={eventName} 
                                onChange={e => setEventName(e.target.value)} 
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Poppins', fontSize: '14px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Total Approved Budget (₹)</label>
                            <input 
                                type="number" 
                                placeholder="E.g. 50000" 
                                value={totalBudget} 
                                onChange={e => setTotalBudget(e.target.value)} 
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontFamily: 'Poppins', fontSize: '14px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button 
                                onClick={handleAddEvent}
                                style={{ flex: 1, padding: '12px', background: '#3B70F7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                            >
                                Add Event
                            </button>
                            <button 
                                onClick={() => setShowForm(false)}
                                style={{ padding: '12px 20px', background: '#e2e8f0', color: '#1d2b3a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="an-view" style={{ padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h2 style={{ margin: 0, fontSize: '24px', color: '#1d2b3a' }}>Event Details</h2>
                <button 
                    onClick={() => setShowForm(true)}
                    style={{ padding: '10px 18px', background: '#3B70F7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
                >
                    + Add Event
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading Events...</div>
            ) : events.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#64748b' }}>
                    <p>No events have been created yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {events.map((evt) => (
                        <div key={evt._id} style={{ background: 'white', padding: '20px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                            <div>
                                <h3 style={{ margin: '0 0 6px', color: '#1d2b3a', fontSize: '17px' }}>{evt.name}</h3>
                                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Created: {new Date(evt.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 700, color: '#a3abc9', textTransform: 'uppercase', letterSpacing: '0.5px' }}>APPROVED BUDGET</p>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#3B70F7' }}>₹{evt.budget.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AdminEvents;
