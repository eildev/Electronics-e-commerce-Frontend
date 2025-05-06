import React from 'react';
import { useNavigate } from 'react-router-dom';
import ColorInit from '../../helper/ColorInit';
import ScrollToTop from 'react-scroll-to-top';
import Preloader from '../../helper/Preloader';
import HeaderThree from '../HeaderThree';
import Breadcrumb from '../Breadcrumb';
import { useSelector } from 'react-redux';

const UserDashboard = () => {
      const { token, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const options = [
        { id: 'orders', label: 'Orders', icon: 'ph-shopping-cart', path: '/orders' },
        // { id: 'quote', label: 'Quote', icon: 'ph-file-text', path: '/quote' },
        { id: 'edit-profile', label: 'Edit Profile', icon: 'ph-user-gear', path: '/edit-profile' },
        { id: 'change-password', label: 'Change Password', icon: 'ph-lock-key', path: '/change-password' },
        { id: 'addresses', label: 'Addresses', icon: 'ph-map-pin', path: '/addresses' },
        { id: 'wishlist', label: 'Wish List', icon: 'ph-heart', path: '/wishlist' },
        // { id: 'saved-pc', label: 'Saved PC', icon: 'ph-desktop', path: '/saved-pc' },
        // { id: 'star-points', label: 'Star Points', icon: 'ph-star', path: '/star-points' },
        { id: 'transactions', label: 'Your Transactions', icon: 'ph-receipt', path: '/transactions' },
    ];

    const handleOptionClick = (optionId) => {
        navigate(`/user-tabs/${optionId}`);
    };

    return (
        <div>

           <section className="user-details py-40 px-4 px-sm-0">
                <div className="container container-lg">
                    <div className="row gy-5">
                        <div className="col-12">
                            <div className="user-details-header d-flex align-items-center justify-content-between mb-40">
                                <div className="d-flex align-items-center gap-16">
                                    <div className="avatar w-64 h-64 rounded-circle bg-gray-200 flex-center">
                                        <i className="ph ph-user text-2xl text-gray-500" />
                                    </div>
                                    <div>
                                        <h6 className="text-xl fw-bold mb-0"><span className='text-base fw-medium'>Hello,</span>  <br />
                                        {token &&  
                        `  ${user.name}`
                      }
                                           </h6>
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-16">
                                    <span className="text-md fw-medium">Shoping Points: 0</span>
                                    {/* <span className="text-md fw-medium">Credit: 0</span> */}
                                </div>
                            </div>
                            <div className="row gy-4 gx-4 ">
                                {options.map(option => (
                                    <div className="col-lg-4 col-sm-6 " key={option.id}>
                                        <div
                                            onClick={() => handleOptionClick(option.id)}
                                            className="user-details-box border border-gray-100 rounded-16 p-24 mt-5 text-center hover-border-main-600 transition-1 h-100 d-flex flex-column justify-content-center"
                                            style={{ minHeight: '200px', cursor: 'pointer' }}
                                        >
                                            <div className="icon w-48 h-48 rounded-circle bg-main-600 text-white flex-center mb-16 mx-auto">
                                                <i className={`ph ${option.icon} text-xl`} />
                                            </div>
                                            <h6 className="text-md fw-semibold mb-0">{option.label}</h6>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UserDashboard;