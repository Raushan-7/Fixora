import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiGetAvailableJobs, apiAcceptJob } from '../utils/api';
import '../styles/dashboard.css';
import '../styles/worker-jobs.css';

const WorkerJobs = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState(null);
    const [filter, setFilter] = useState('All');

    const loadJobs = async () => {
        try {
            setLoading(true);
            const data = await apiGetAvailableJobs();
            setJobs(data);
        } catch (err) {
            console.error('Failed to load available jobs:', err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleAccept = async (jobId) => {
        if (!window.confirm('Accept this job? It will be removed from the available list.')) return;
        try {
            setAccepting(jobId);
            await apiAcceptJob(jobId);
            // Remove accepted job from list
            setJobs((prev) => prev.filter((j) => j._id !== jobId));
        } catch (err) {
            alert('Failed to accept job: ' + err.message);
        } finally {
            setAccepting(null);
        }
    };

    const services = [...new Set(jobs.map((j) => j.serviceName))];
    const filteredJobs = filter === 'All' ? jobs : jobs.filter((j) => j.serviceName === filter);

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="worker-jobs-header">
                    <div>
                        <h1>Available Jobs</h1>
                        <p>Browse and accept service requests from customers near you</p>
                    </div>
                    <button className="btn btn-outline" onClick={loadJobs}>
                        🔄 Refresh
                    </button>
                </div>

                {/* Stats */}
                <div className="dashboard-stats" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div className="stat-card">
                        <div className="stat-label">Available Jobs</div>
                        <div className="stat-value">{jobs.length}</div>
                    </div>
                    <div className="stat-card secondary">
                        <div className="stat-label">Service Types</div>
                        <div className="stat-value">{services.length}</div>
                    </div>
                </div>

                {/* Service filter */}
                {services.length > 0 && (
                    <div className="services-filters" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div className="filter-group">
                            <label className="filter-label">Filter by Service</label>
                            <div className="category-filters">
                                <button
                                    className={`category-btn ${filter === 'All' ? 'active' : ''}`}
                                    onClick={() => setFilter('All')}
                                >
                                    All ({jobs.length})
                                </button>
                                {services.map((svc) => (
                                    <button
                                        key={svc}
                                        className={`category-btn ${filter === svc ? 'active' : ''}`}
                                        onClick={() => setFilter(svc)}
                                    >
                                        {svc} ({jobs.filter((j) => j.serviceName === svc).length})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Job list */}
                {loading ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">⏳</div>
                        <h3>Loading available jobs…</h3>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🔍</div>
                        <h3>No jobs available right now</h3>
                        <p>Check back soon — new customer requests appear here as they come in.</p>
                        <button className="btn btn-primary" style={{ marginTop: 'var(--spacing-lg)' }} onClick={loadJobs}>
                            Refresh Jobs
                        </button>
                    </div>
                ) : (
                    <div className="job-list">
                        {filteredJobs.map((job) => (
                            <div key={job._id} className="job-card">
                                <div className="job-card-top">
                                    <div className="job-card-title-wrap">
                                        <h3 className="job-card-title">{job.serviceName}</h3>
                                        <span className="badge badge-pending">Pending</span>
                                    </div>
                                    <div className="job-card-price">{job.price}</div>
                                </div>

                                <div className="job-card-details">
                                    <div className="job-detail">
                                        <span className="job-detail-icon">📅</span>
                                        <span>
                                            {new Date(job.date).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="job-detail">
                                        <span className="job-detail-icon">🕐</span>
                                        <span>{job.time}</span>
                                    </div>
                                    <div className="job-detail">
                                        <span className="job-detail-icon">📍</span>
                                        <span>{job.address}</span>
                                    </div>
                                    {job.notes && (
                                        <div className="job-detail">
                                            <span className="job-detail-icon">📝</span>
                                            <span>{job.notes}</span>
                                        </div>
                                    )}
                                    {job.userId && (
                                        <div className="job-detail">
                                            <span className="job-detail-icon">👤</span>
                                            <span>
                                                {job.userId.name}
                                                {job.userId.phone ? ` · ${job.userId.phone}` : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="job-card-footer">
                                    <span className="job-posted">
                                        Posted {new Date(job.createdAt).toLocaleDateString('en-IN')}
                                    </span>
                                    <button
                                        className="btn btn-primary btn-small"
                                        onClick={() => handleAccept(job._id)}
                                        disabled={accepting === job._id}
                                    >
                                        {accepting === job._id ? 'Accepting…' : '✅ Accept Job'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WorkerJobs;
