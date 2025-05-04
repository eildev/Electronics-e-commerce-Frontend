import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCsrfTokenQuery, useLoginUserMutation } from '../redux/features/api/authApi';
import { useForm } from 'react-hook-form';
import { loginFailure, loginStart, loginSuccess } from '../redux/features/slice/authSlice';
import toast from 'react-hot-toast';
import { Icon } from '@iconify/react/dist/iconify.js';

const Login = ({ onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: csrfData, isLoading: csrfLoading, refetch: refetchCsrf } = useGetCsrfTokenQuery();
  const [loginUser, { isLoading: loginLoading }] = useLoginUserMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleLogin = async (data) => {
    console.log('Login form data:', data);
    dispatch(loginStart());
    try {
      await refetchCsrf();
      let result;
      try {
        result = await loginUser({
          email: data.email,
          password: data.password,
        }).unwrap();
      } catch (err) {
        if (err?.status === 419 || err?.data?.message === 'CSRF token mismatch') {
          console.log('CSRF token mismatch, retrying...');
          await refetchCsrf();
          result = await loginUser({
            email: data.email,
            password: data.password,
          }).unwrap();
        } else {
          throw err;
        }
      }

      console.log('Login API response:', result);
      if (result.status === 200 || result.status === 201) {
        dispatch(loginSuccess(result));
        toast.success('Login successful!');
        navigate('/');
      } else {
        dispatch(loginFailure(result.message || 'Login failed'));
        toast.error(result.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      dispatch(loginFailure(err?.data?.message || 'Login failed'));
      toast.error(err?.data?.message || 'Invalid credentials, please try again');
    }
  };

  return (
    <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
      <h6 className="text-xl mb-32">Login</h6>
      <form onSubmit={handleSubmit(handleLogin)}>
        <div className="mb-24">
          <label htmlFor="login-email" className="text-neutral-900 text-lg mb-8 fw-medium">
            Email address <span className="text-danger">*</span>
          </label>
          <input
            type="email"
            className="common-input"
            id="login-email"
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
          <label htmlFor="login-password" className="text-neutral-900 text-lg mb-8 fw-medium">
            Password <span className="text-danger">*</span>
          </label>
          <div className="position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="common-input"
              id="login-password"
              placeholder="Enter Password"
              {...register('password', { required: 'Password is required' })}
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
        <div className="mb-24 mt-48">
          <div className="flex-align gap-48 flex-wrap">
            <button
              type="submit"
              className="btn btn-main py-18 px-40"
              disabled={loginLoading || csrfLoading}
            >
              {loginLoading ? 'Logging in...' : 'Log in'}
            </button>
            <div className="form-check common-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="remember"
                {...register('remember')}
              />
              <label className="form-check-label flex-grow-1" htmlFor="remember">
                Remember me
              </label>
            </div>
          </div>
        </div>
        <div className="mt-48">
          <Link
            to="#"
            className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
          >
            Forgot your password?
          </Link>
        </div>
        <div className="mt-24">
          <p className="text-gray-500">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-main-600 text-decoration-underline hover-text-decoration-underline"
            >
              Register here
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;