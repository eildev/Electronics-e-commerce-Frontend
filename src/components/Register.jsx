import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useGetCsrfTokenQuery, useRegisterUserMutation } from '../redux/features/api/authApi';
import { loginFailure, loginStart, loginSuccess } from '../redux/features/slice/authSlice';

const Register = ({ onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: csrfData, isLoading: csrfLoading, refetch: refetchCsrf } = useGetCsrfTokenQuery();
  const [registerUser, { isLoading: registerLoading }] = useRegisterUserMutation();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((prev) => !prev);

  const handleRegister = async (data) => {
    console.log('Register form data:', data);
    dispatch(loginStart());
    try {
      await refetchCsrf();
      let result;
      console.log(result);
      try {
        result = await registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        }).unwrap();
      } catch (err) {
        if (err?.status === 419 || err?.data?.message === 'CSRF token mismatch') {
          console.log('CSRF token mismatch, retrying...');
          await refetchCsrf();
          result = await registerUser({
            name: data.name,
            email: data.email,
            password: data.password,
            password_confirmation: data.password_confirmation,
          }).unwrap();
        } else {
          throw err;
        }
      }

      console.log('Register API response:', result);
      if (result.status === 200 || result.status === 201) {
        dispatch(loginSuccess(result));
        toast.success('Registration successful! You are now logged in.');
        navigate('/');
      } else {
        dispatch(loginFailure(result.message || 'Registration failed'));
        toast.error(result.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorData = err?.data || {};
      dispatch(loginFailure(errorData.message || 'Registration failed'));

      if (errorData.errors) {
        Object.keys(errorData.errors).forEach((field) => {
          setError(field, {
            type: 'manual',
            message: errorData.errors[field][0],
          });
        });
        toast.error('Please fix the errors in the form');
      } else {
        toast.error(errorData.message || 'Something went wrong, try again later');
      }
    }
  };

  return (
    <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
      <h6 className="text-xl mb-32">Register</h6>
      <form onSubmit={handleSubmit(handleRegister)}>
        <div className="mb-24">
          <label htmlFor="register-name" className="text-neutral-900 text-lg mb-8 fw-medium">
            Username <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="common-input"
            id="register-name"
            placeholder="Write a username"
            {...register('name', { required: 'Username is required' })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div className="mb-24">
          <label htmlFor="register-email" className="text-neutral-900 text-lg mb-8 fw-medium">
            Email address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="common-input"
            id="register-email"
            placeholder="Enter Email Address"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div className="mb-24">
          <label htmlFor="register-password" className="text-neutral-900 text-lg mb-8 fw-medium">
            Password <span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="common-input"
              id="register-password"
              placeholder="Enter Password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon
                icon={showPassword ? 'ooui:eye-closed' : 'ooui:eye'}
                width="1.5em"
                height="2em"
                style={{ color: '#898989' }}
              />
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div className="mb-24">
          <label htmlFor="register-confirm-password" className="text-neutral-900 text-lg mb-8 fw-medium">
            Confirm Password <span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="common-input"
              id="register-confirm-password"
              placeholder="Confirm Password"
              {...register('password_confirmation', {
                required: 'Confirm Password is required',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer"
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              <Icon
                icon={showConfirmPassword ? 'ooui:eye-closed' : 'ooui:eye'}
                width="1.5em"
                height="2em"
                style={{ color: '#898989' }}
              />
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
          )}
        </div>
        <div className="my-48">
          <p className="text-gray-500">
            Your personal data will be used to support your experience throughout this website, and for other purposes
            described in our{' '}
            <Link to="#" className="text-main-600 text-decoration-underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="mt-48">
          <button
            type="submit"
            className="btn btn-main py-18 px-40"
            disabled={registerLoading || csrfLoading}
          >
            {registerLoading ? 'Signing up...' : 'Register'}
          </button>
        </div>
        <div className="mt-24">
          <p className="text-gray-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-main-600 text-decoration-underline hover-text-decoration-underline"
            >
              Login here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;