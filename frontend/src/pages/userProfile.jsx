import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getMe, updateProfile } from '../api/userAPI';
import { uploadImageTournamentAndPlayer } from '../api/imageAPI';
import { ArrowLeftIcon } from '@heroicons/react/24/outline'; // Thêm icon ArrowLeft

const UserProfile = () => {
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
        profilePic: localStorage.getItem('profilePic') || 'https://via.placeholder.com/150',
        name: JSON.parse(localStorage.getItem('user'))?.name || 'Unnamed User',
        phone: localStorage.getItem('phone') || '',
        profilePicPreview: '',
    });

    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getMe();
                setUserInfo({
                    profilePic: userData.profilePic || 'https://via.placeholder.com/150',
                    name: userData.name || 'Unnamed User',
                    phone: userData.phone || '',
                });
            } catch (err) {
                setError('Failed to load user data');
                toast.error('Failed to load user data');
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleChange = (e) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUserInfo({
                    ...userInfo,
                    profilePic: file,
                    profilePicPreview: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editMode) {
            if (!userInfo.name.trim()) {
                setError('Name is required.');
                return;
            }
            if (userInfo.phone && !/^\d{10,15}$/.test(userInfo.phone)) {
                setError('Please enter a valid phone number (10-15 digits).');
                return;
            }

            setLoading(true);
            try {
                let profilePicUrl = userInfo.profilePic;

                if (userInfo.profilePic instanceof File) {
                    const id = `user_${Date.now()}`;
                    profilePicUrl = await uploadImageTournamentAndPlayer(id, userInfo.profilePic);
                }
                console.log('toi day');

                const userData = {
                    name: userInfo.name,
                    phone: userInfo.phone,
                    profilePic: profilePicUrl,
                };
                const updatedData = await updateProfile(userData);
                console.log('updatedData', updatedData);

                const updatedUser = {
                    id: updatedData._id,
                    name: updatedData.name,
                    phone: updatedData.phone,
                    profilePic: updatedData.profilePic,
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));

                console.log(localStorage.getItem('user'));

                toast.success('Profile updated successfully!', {
                    autoClose: 1500,
                });
                setEditMode(false);
                setError('');
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to update profile');
                toast.error(err.response?.data?.message || 'Failed to update profile');
            } finally {
                setLoading(false);
            }
        } else {
            setEditMode(true);
        }
    };

    const handleBack = () => {
        navigate(-1); // Quay lại trang trước đó
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex justify-center items-start">
            <div className="w-full max-w-6xl bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 backdrop-blur-lg">
                {/* Header */}
                <div className="relative bg-gray-800 p-6">
                    <button
                        onClick={handleBack}
                        className="absolute top-6 left-6 p-2 bg-blue-500/80 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 shadow-lg"
                        aria-label="Back to previous page"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-white" />
                    </button>
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-tight text-center">
                        Your Profile
                    </h2>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col md:flex-row items-center">
                    {/* Avatar Section */}
                    <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                        {!userInfo.profilePicPreview ? (
                            <img
                                src={userInfo.profilePic}
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
                            />
                        ) : (
                            <img
                                src={userInfo.profilePicPreview}
                                alt="Profile"
                                className="w-40 h-40 rounded-full object-cover border-4 border-blue-500 shadow-md"
                            />
                        )}

                        {editMode && (
                            <div className="mt-4 text-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                                />
                            </div>
                        )}
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div className="bg-gray-700/70 p-4 rounded-lg shadow-sm border border-gray-600/20">
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Full Name
                                </label>
                                <input
                                    className={`w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        !editMode ? 'bg-opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name..."
                                    value={userInfo.name}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>

                            {/* Phone */}
                            <div className="bg-gray-700/70 p-4 rounded-lg shadow-sm border border-gray-600/20">
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    className={`w-full p-3 rounded-md bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        !editMode ? 'bg-opacity-50 cursor-not-allowed' : ''
                                    }`}
                                    type="text"
                                    name="phone"
                                    placeholder="Enter your phone number..."
                                    value={userInfo.phone}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                />
                            </div>

                            {error && (
                                <p className="text-red-400 text-sm bg-red-900/20 p-2 rounded-md text-center">
                                    {error}
                                </p>
                            )}

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-md transition-all duration-300 hover:scale-105 shadow-md ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Updating...' : editMode ? 'Update Profile' : 'Edit Profile'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer position="top-center" />
        </div>
    );
};

export default UserProfile;