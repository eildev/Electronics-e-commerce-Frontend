import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useGetCsrfTokenQuery, useGetUserInfoQuery, useUpdateUserMutation } from '../../redux/features/api/authApi';

const EditProfile = () => {
    const { token, user } = useSelector((state) => state.auth);
    const userID = user?.id;

    // Fetch CSRF token for Laravel Sanctum
    useGetCsrfTokenQuery();

    // Fetch user info
    const { data, isLoading } = useGetUserInfoQuery(userID, {
        skip: !userID,
    });

    // Update user mutation
    const [
        updateUser,
        {
            isLoading: isUpdating,
            isSuccess: isUpdated,
            isError: updateError,
            error,
        },
    ] = useUpdateUserMutation();

    // Form setup with react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            full_name: '',
            email: '',
            phone: '',
            address: '',
            country: '',
            region: '',
            zone: '',
            postalCode: '',
        },
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // Populate form with user data
    useEffect(() => {
        if (data?.user) {
            const rawPhone = data?.userDetails?.phone_number || '';
            const formattedPhone = rawPhone
                ? String(rawPhone).startsWith('0')
                    ? rawPhone
                    : `0${rawPhone}`
                : '';

            const userData = {
                full_name: data?.user?.name || '',
                email: data?.user?.email || '',
                phone: formattedPhone,
                address: data?.userDetails?.address || '',
                country: data?.userDetails?.country || '',
                region: data?.userDetails?.city || '',
                zone: data?.userDetails?.police_station || '',
                postalCode: data?.userDetails?.postal_code || '',
            };
            console.log('Populating form with:', userData); // Debug
            reset(userData);
            if (data.userDetails?.image) {
                setImagePreview(data.userDetails.image);
            }
        }
    }, [data, reset]);

    // Handle form submission
    const onSubmit = async (formData) => {
        console.log('Collected Form Data:', formData);

        const formPayload = new FormData();
        formPayload.append('full_name', formData.full_name);
        formPayload.append('email', formData.email);
        formPayload.append('phone_number', formData.phone);
        formPayload.append('address', formData.address);
        formPayload.append('country', formData.country);
        formPayload.append('city', formData.region);
        formPayload.append('police_station', formData.zone);
        formPayload.append('postal_code', formData.postalCode);

        if (imageFile) {
            console.log('Appending image:', imageFile.name, imageFile.type); // Debug
            formPayload.append('image', imageFile);
        } else {
            console.log('No image file selected');
        }

        // Debug FormData contents
        for (const [key, value] of formPayload.entries()) {
            console.log(`FormData - ${key}: ${value instanceof File ? value.name : value}`);
        }

        try {
            const response = await updateUser({ id: userID, data: formPayload }).unwrap();
            console.log('Profile updated successfully:', response);
        } catch (err) {
            console.error('Update failed:', err);
            console.log('Error details:', err?.status, err?.data);
        }
    };

    // Handle image file change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            console.log('Selected file:', file.name, file.type); // Debug
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            console.log('No file selected');
        }
    };

    return (
        <section className="py-40 animate__animated animate__fadeIn">
            <div className="container container-lg">
                <div className="mb-40">
                    <h3 className="fw-bold text-gray-900">Edit Your Profile</h3>
                </div>
                <div className="row">
                    <div className="col-lg-4 col-md-5 mb-40 mb-lg-0">
                        <div className="border border-gray-100 rounded-8 px-24 py-40 text-center">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="rounded-circle mb-24"
                                    style={{ width: '120px', height: '120px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle bg-gray-100 mb-24 d-flex align-items-center justify-content-center"
                                    style={{ width: '120px', height: '120px', margin: '0 auto' }}
                                >
                                    <span className="text-gray-500">No Image</span>
                                </div>
                            )}
                            <h4 className="text-md fw-semibold text-gray-900 mb-8">{data?.user?.name || 'User Name'}</h4>
                            <p className="text-sm text-gray-600">{data?.user?.email || 'user@example.com'}</p>
                        </div>
                    </div>
                    <div className="col-lg-8 col-md-7">
                        <form id="edit-profile-form" onSubmit={handleSubmit(onSubmit)}>
                            {isUpdated && (
                                <div className="alert alert-success alert-dismissible mb-40 rounded-8" role="alert">
                                    Profile updated successfully!
                                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            )}
                            {updateError && (
                                <div className="alert alert-danger alert-dismissible mb-40 rounded-8" role="alert">
                                    Failed to update profile: {error?.data?.message || 'Please try again.'}
                                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            )}
                            {isLoading && <div className="text-center mb-40">Loading...</div>}

                            <div className="row gy-3">
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className={`common-input border-gray-100 ${errors.full_name ? 'is-invalid' : ''}`}
                                        placeholder="Full Name *"
                                        {...register('full_name', { required: 'Full Name is required' })}
                                    />
                                    {errors.full_name && (
                                        <div className="invalid-feedback">{errors.full_name.message}</div>
                                    )}
                                </div>
                                <div className="col-12">
                                    <input
                                        type="email"
                                        className={`common-input border-gray-100 ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="Email Address *"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email.message}</div>
                                    )}
                                </div>
                                <div className="col-12">
                                    <input
                                        type="tel"
                                        className={`common-input border-gray-100 ${errors.phone ? 'is-invalid' : ''}`}
                                        placeholder="Phone Number *"
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^0[0-9]{9,}$/,
                                                message: 'Invalid phone number',
                                            },
                                        })}
                                    />
                                    {errors.phone && (
                                        <div className="invalid-feedback">{errors.phone.message}</div>
                                    )}
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="common-input border-gray-100"
                                        placeholder="Address"
                                        {...register('address')}
                                    />
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="common-input border-gray-100"
                                        placeholder="Country"
                                        {...register('country')}
                                    />
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="common-input border-gray-100"
                                        placeholder="Region/City"
                                        {...register('region')}
                                    />
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="common-input border-gray-100"
                                        placeholder="Zone/Police Station"
                                        {...register('zone')}
                                    />
                                </div>
                                <div className="col-12">
                                    <input
                                        type="text"
                                        className="common-input border-gray-100"
                                        placeholder="Postal Code"
                                        {...register('postalCode')}
                                    />
                                </div>
                                <div className="col-12">
                                    <input
                                        type="file"
                                        className="border-gray-100"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <button
                                        type="submit"
                                        className={`btn btn-main py-18 w-100 rounded-8 ${isUpdating ? 'disabled' : ''}`}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? 'Updating...' : 'Update Profile'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .edit-profile {
                    background-color: #f8f9fa;
                }
                .common-input {
                    border: 1px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 0.75rem 1rem;
                    width: 100%;
                    font-size: 1rem;
                    color: #374151;
                    background-color: #fff;
                }
                .common-input:focus {
                    border-color: #fa8232;
                    box-shadow: 0 0 0 0.2rem rgba(250, 130, 50, 0.25);
                    outline: none;
                }
                .common-input::placeholder {
                    color: #6b7280;
                }
                .btn-main {
                    background-color: #fa8232;
                    border-color: #fa8232;
                    color: #fff;
                    padding: 18px;
                    border-radius: 8px;
                    font-size: 1rem;
                    font-weight: 500;
                    width: 100%;
                }
                .btn-main:hover,
                .btn-main:focus {
                    background-color: #e66b1e;
                    border-color: #e66b1e;
                }
                .btn-main.disabled {
                    background-color: #fa8232;
                    border-color: #fa8232;
                    opacity: 0.65;
                    cursor: not-allowed;
                }
                .alert {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 15px;
                    font-size: 0.875rem;
                }
                .border-gray-100 {
                    border-color: #e5e7eb;
                }
                .rounded-8 {
                    border-radius: 8px;
                }
                .px-24 {
                    padding-left: 24px;
                    padding-right: 24px;
                }
                .py-40 {
                    padding-top: 40px;
                    padding-bottom: 40px;
                }
                .px-30 {
                    padding-left: 30px;
                    padding-right: 30px;
                }
                .py-20 {
                    padding-top: 20px;
                    padding-bottom: 20px;
                }
                .mb-24 {
                    margin-bottom: 24px;
                }
                .mb-40 {
                    margin-bottom: 40px;
                }
                .text-lg {
                    font-size: 1.25rem;
                }
                .text-md {
                    font-size: 1rem;
                }
                .text-sm {
                    font-size: 0.875rem;
                }
                .fw-semibold {
                    font-weight: 600;
                }
                .text-gray-900 {
                    color: #374151;
                }
                .text-gray-600 {
                    color: #6b7280;
                }
                .bg-gray-100 {
                    background-color: #f3f4f6;
                }
            `}</style>
        </section>
    );
};

export default EditProfile;