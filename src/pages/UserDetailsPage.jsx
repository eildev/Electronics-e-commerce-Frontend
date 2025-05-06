import React from 'react';
import ColorInit from '../helper/ColorInit';
import ScrollToTop from 'react-scroll-to-top';
import Preloader from '../helper/Preloader';
import Breadcrumb from '../components/Breadcrumb';
import HeaderTwo from '../components/HeaderTwo';
import UserDashboard from '../components/UserDashboard/UserDashboard';

const UserDetailsPage = () => {
  return (
<div>
      {/* ColorInit */}
      <ColorInit color={true} />

      {/* ScrollToTop */}
      <ScrollToTop smooth color="#FA6400" />

      {/* Preloader */}
      <Preloader />

      {/* HeaderOne */}
      <HeaderTwo category={true} />
      {/* Breadcrumb */}
      <Breadcrumb title={"User Details"} />
      <UserDashboard></UserDashboard>
</div>
  );
};

export default UserDetailsPage;