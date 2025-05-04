import React from 'react';

import { useState } from 'react';
import { Form } from 'react-router-dom';
import { useSubscribeUserMutation } from '../redux/features/api/subscriptionApi';

const SubscribeInput = () => {
    const [email, setEmail] = useState("");
    const [subscribeUser, { isLoading, isError, isSuccess }] =
        useSubscribeUserMutation();

    const handleSubscribe = async (e) => {
        e.preventDefault();
        console.log(email);
        if (email) {
            await subscribeUser(email);
            console.log(subscribeUser);
            setEmail("");
        }
    };
    return (
        <div >
            <form className="position-relative mt-40" onSubmit={handleSubscribe}>
                <div>


                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control common-input rounded-pill text-white py-22 px-16 pe-144"
                        placeholder="Your email address..."
                    />
                    <button
                        type="submit"
                        className="btn btn-main-two rounded-pill position-absolute top-50 translate-middle-y inset-inline-end-0 me-10"
                        disabled={isLoading}
                    >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                    </button>
                </div>
                
            </form>
            {isSuccess && (
                    <p style={{ color: "green" }}>Subscription successful!</p>
                )}
                {isError && (
                    <p style={{ color: "red" }}>
                        Failed to subscribe. Try again.
                    </p>
                )}
        </div>
    );
};

export default SubscribeInput;