
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './TrackingPage.css';

const API_URL = 'http://localhost:5000'; // Replace with your backend URL

const TrackingPage = () => {
    const { id } = useParams(); // Order ID from URL parameters
    const [tracking, setTracking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [currentActionIndex, setCurrentActionIndex] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [completedActions, setCompletedActions] = useState({});

    const actions = ['received', 'accepted', 'prepared', 'out-for-delivery', 'delivered'];

    const fetchTracking = async () => {
        try {
            const response = await fetch(`${API_URL}/api/tracking/items/${id}/tracking`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTracking(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tracking data:', error);
            setLoading(false);
        }
    };

    const fetchUserRole = async () => {
        try {
            const response = await fetch(`${API_URL}/api/user`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUserRole(data.role);
        } catch (error) {
            console.error('Error fetching user role:', error);
        }
    };

    const handleLogAction = async (action, index) => {
        if (index !== currentActionIndex) {
            setErrorMessage(`Please complete "${actions[currentActionIndex]}" first.`);
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/tracking/items/${id}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const nextActionIndex = currentActionIndex + 1;
            setCurrentActionIndex(nextActionIndex);

            const updatedActions = { ...completedActions, [id]: nextActionIndex };
            setCompletedActions(updatedActions);
            localStorage.setItem('completedActions', JSON.stringify(updatedActions));

            fetchTracking();
        } catch (error) {
            console.error('Error logging action:', error);
        }
    };

    useEffect(() => {
        const storedActions = JSON.parse(localStorage.getItem('completedActions')) || {};
        const storedActionIndex = storedActions[id] || 0;
        setCompletedActions(storedActions);
        setCurrentActionIndex(storedActionIndex);

        fetchTracking();
        fetchUserRole();
    }, [id]);

    if (loading) {
        return <div className="loading-message">Loading...</div>;
    }

    const sortedTracking = [...tracking].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return (
        <div className="tracking-page">
            <h1 className="page-title">Tracking Information</h1>
            <div className="content">
                <div className="button-column">
                    {actions.map((action, index) => (
                        <React.Fragment key={action}>
                            <div className="button-wrapper">
                                {userRole === 'Admin' ? (
                                    <button
                                        className={`action-box ${
                                            index === currentActionIndex
                                                ? 'active-box'
                                                : index < currentActionIndex
                                                ? 'completed-box'
                                                : 'pending-box'
                                        }`}
                                        onClick={() => handleLogAction(action, index)}
                                        disabled={index !== currentActionIndex}
                                    >
                                        {index < currentActionIndex && '✓'}
                                    </button>
                                ) : (
                                    <div
    className={`action-box ${
        index < currentActionIndex
            ? 'completed-box'
            : index === currentActionIndex
            ? 'active-box'
            : 'pending-box'
    }`}
                                    >
                                        {index < currentActionIndex && '✓'}
                                    </div>
                                )}
                                <span className="action-label">{action.replace('-', ' ')}</span>
                            </div>
                            {index < actions.length - 1 && (
                                <div
                                    className={`line ${
                                        index < currentActionIndex 
                                            ? 'completed' 
                                            : 'pending'
                                    }`}
                                ></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <div className="tracking-history">
                    <h2 className="history-title">Tracking History</h2>
                    <ul>
                        {sortedTracking.map((track) => (
                            <li key={track._id}>
                                <span className="action-name">{track.action}</span> by <b>{track.user}</b> at{' '}
                                <time>{new Date(track.timestamp).toLocaleString()}</time>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;
