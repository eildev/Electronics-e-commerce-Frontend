import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Account = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleSwitchToRegister = () => setShowLogin(false);
  const handleSwitchToLogin = () => setShowLogin(true);

  return (
    <section className="account py-80">
      <div className="container container-lg">
        <div className="row gy-4">
          <div className="col-xl-6 offset-xl-3">
            {showLogin ? (
              <Login onSwitchToRegister={handleSwitchToRegister} />
            ) : (
              <Register onSwitchToLogin={handleSwitchToLogin} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;