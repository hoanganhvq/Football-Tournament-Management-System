import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/userAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
    const navigate = useNavigate();
    const [formInfo, setFormInfo] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleChange = (e) => {
        setFormInfo({
            ...formInfo,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formInfo.name.trim() === '') {
            setError('Full name is required.');
            return;
        }

        if (!validateEmail(formInfo.email)) {
            setError('Invalid email address.');
            return;
        }

        if (formInfo.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        try {
            setLoading(true);
            const res = await register(formInfo);

            toast.success('User registered successfully. Please log in.', {
                onClose: () => navigate('/sign-in'),
                autoClose: 1500,
            });

            const { token, user } = res;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setTimeout(() => {
                navigate('/sign-in');
            }, 1500);

            setError('');
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
                toast.error(error.response.data.message);
            } else {
                setError('Failed to register user');
                toast.error('Failed to register user');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/background6.jpg)' }}
        >
            <div className="bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-2xl p-10 max-w-lg w-full transform transition-all duration-300 hover:scale-105">
                <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Join Us Today
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
                        <input
                            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            type="text"
                            name="name"
                            placeholder="Enter your full name..."
                            value={formInfo.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                        <input
                            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            type="email" // Sửa từ "text" thành "email" để phù hợp hơn
                            name="email"
                            placeholder="Enter your email..."
                            value={formInfo.email} // Sửa lỗi value từ "formInfo.user" thành "formInfo.email"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                        <input
                            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            type="password"
                            name="password"
                            placeholder="Enter your password..."
                            value={formInfo.password}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm mt-2 bg-red-900 bg-opacity-20 p-2 rounded-md text-center">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-gray-300 mt-4">
                        Already have an account?{' '}
                        <Link
                            to="/sign-in"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
                <ToastContainer position="top-center" />
            </div>
        </div>
    );
};

export default SignUp;