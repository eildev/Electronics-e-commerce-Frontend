import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ColorInit from '../../helper/ColorInit';
import Preloader from '../../helper/Preloader';
import HeaderThree from '../HeaderThree';
import Breadcrumb from '../Breadcrumb';
import ScrollToTop from 'react-scroll-to-top';
import WishlistTable from './WishlistTable';
import EditProfile from './EditProfile';
import OrdersTable from './OrdersTable';

const UserTabs = () => {
    const { token, user } = useSelector((state) => state.auth);
    const { tabId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tabId || 'edit-profile');

    useEffect(() => {
        if (tabId && tabs.find(tab => tab.id === tabId)) {
            setActiveTab(tabId);
        } else {
            setActiveTab('edit-profile');
        }
    }, [tabId]);

    const tabs = [
        { id: 'orders', label: 'Orders', icon: 'ph-shopping-cart' },
        { id: 'edit-profile', label: 'Edit Profile', icon: 'ph-user-gear' },
        { id: 'change-password', label: 'Change Password', icon: 'ph-lock-key' },
        { id: 'addresses', label: 'Addresses', icon: 'ph-map-pin' },
        { id: 'wishlist', label: 'Wish List', icon: 'ph-heart' },
        { id: 'transactions', label: 'Your Transactions', icon: 'ph-receipt' },
    ];

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        navigate(`/user-tabs/${tabId}`);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'edit-profile':
                return <EditProfile />;
            case 'orders':
                return (
                    <div className="p-4  p-md-5 animate__animated animate__fadeIn">
                        <h3 className="mb-40 mt-40 fw-bold text-dark">Orders</h3>
                        <OrdersTable />
                    </div>
                );
            case 'change-password':
                return (
                    <div className="p-4 p-md-5 animate__animated animate__fadeIn">
                        <h3 className="mb-40 mt-40 fw-bold text-dark">Change Password</h3>
                        <form>
                            <div className="mb-4">
                                <label className="form-label fw-medium text-dark">Current Password *</label>
                                <input type="password" className="form-control shadow-sm rounded-3" />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-medium text-dark">New Password *</label>
                                <input type="password" className="form-control shadow-sm rounded-3" />
                            </div>
                            <div className="mb-4">
                                <label className="form-label fw-medium text-dark">Confirm New Password *</label>
                                <input type="password" className="form-control shadow-sm rounded-3" />
                            </div>
                            <button type="button" className="btn btn-primary btn-lg shadow-sm rounded-3">
                                Save Changes
                            </button>
                        </form>
                    </div>
                );
            case 'addresses':
                return (
                    <div className="p-4 p-md-5 animate__animated animate__fadeIn">
                        <h3 className="mb-40 mt-40 fw-bold text-dark">Addresses</h3>
                        <p className="text-muted">Your saved addresses will be displayed here.</p>
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="p-4 p-md-5 animate__animated animate__fadeIn">
                        <h3 className="mb-40 mt-40 fw-bold text-dark">Wish List</h3>
                        <WishlistTable />
                    </div>
                );
            case 'transactions':
                return (
                    <div className="p-4 p-md-5 animate__animated animate__fadeIn">
                        <h3 className="mb-4 fw-bold text-dark">Your Transactions</h3>
                        <p className="text-muted">Your transaction history will be displayed here.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <ColorInit color={true} />
            <ScrollToTop smooth color="#fa8232" />
            <Preloader />
            <HeaderThree category={false} />
            <Breadcrumb title="User Dashboard" />

            <section className="py-5 mt-20">
                <div className="container container-lg">
                    <div className="mb-10">
                        <button
                            className="mb-20"
                            onClick={() => navigate('/user-details')}
                        >
                            <i className="ph ph-arrow-left me-2"></i> Back
                        </button>
                    </div>

                    <div className="card border-0 rounded-4">
                        <div className="card-header bg-gradient-accent text-white border-0 rounded-top-4">
                            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-between py-3">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="rounded-circle bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '72px', height: '72px' }}>
                                        <i className="ph ph-user fs-2 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="mb-1 text-white">
                                            {token && `Hello, ${user.name}`}
                                        </h4>
                                        <small className="text-white opacity-75">Manage your account & orders</small>
                                    </div>
                                </div>
                                <div className="mt-3 mt-md-0">
                                    <span className="badge text-white px-3 py-2">Shopping Points: 0</span>
                                </div>
                            </div>
                        </div>

                        <div className="row g-0">
                            <div className="col-lg-3 bg-white border-end">
                                <div className="nav flex-column nav-pills p-4" role="tablist">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            className={`nav-link d-flex align-items-center gap-3 mb-3 text-start rounded-3 ${activeTab === tab.id ? 'active bg-accent text-white' : 'text-dark'}`}
                                            onClick={() => handleTabClick(tab.id)}
                                            style={{ transition: 'all 0.3s' }}
                                        >
                                            <i className={`ph ${tab.icon} fs-5`}></i>
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="">{renderContent()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .bg-gradient-accent {
                    background: linear-gradient(90deg, #fa8232, #ffaa66);
                }
                .bg-accent {
                    background-color: #fa8232 !important;
                }
                .nav-link {
                    padding: 12px 16px;
                }
                .nav-link:hover:not(.active) {
                    background-color: #e9ecef;
                    transform: translateX(8px);
                    color: #fa8232 !important;
                }
                .nav-link.active {
                    background-color: #fa8232 !important;
                    border-color: #fa8232 !important;
                }
                .card {
                    overflow: hidden;
                }
                .btn-primary {
                    background-color: #fa8232;
                    border-color: #fa8232;
                    padding: 10px 24px;
                }
                .btn-primary:hover, .btn-primary:focus {
                    background-color: #e66b1e;
                    border-color: #e66b1e;
                }
                .btn-outline-accent {
                    border-color: #fa8232;
                    color: #fa8232;
                }
                .btn-outline-accent:hover {
                    background-color: #fa8232;
                    border-color: #fa8232;
                    color: #fff;
                }
                .form-control {
                    padding: 10px;
                    border-radius: 8px;
                }
                .form-control:focus {
                    border-color: #fa8232;
                   
                }
                @media (max-width: 991px) {
                    .nav-pills {
                        flex-direction: row !important;
                        flex-wrap: wrap;
                        gap: 10px;
                    }
                    .nav-link {
                        flex: 1 1 auto;
                        text-align: center;
                    }
                    .nav-link:hover:not(.active) {
                        transform: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default UserTabs;