import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/userAPI';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext';

const SignIn = () => {
    const navigate = useNavigate();
    const { login: setAuthLogin } = useAuth();
    const [formInfo, setFormInfo] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormInfo({
            ...formInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formInfo.email || !formInfo.password) {
            setError('Please fill in all fields');
            return;
        }
        if (formInfo.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        setIsLoading(true);
        try {
            const res = await login(formInfo);
            const { token, user } = res;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');

            setAuthLogin(true);

            toast.success(`Welcome back, ${user.name}!`, {
                onClose: () => navigate('/home'),
                autoClose: 1500,
            });
            setTimeout(() => {
                navigate('/home');
            }, 1500);

            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: 'url(/images/background6.jpg)' }}
        >
            <div className="bg-gray-900 bg-opacity-90 text-white rounded-xl shadow-2xl p-10 max-w-lg w-full transform transition-all duration-300 hover:scale-105">
                <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Welcome Back
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                        <input
                            className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            type="email"
                            name="email"
                            placeholder="Enter your email..."
                            value={formInfo.email}
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
                        disabled={isLoading}
                        className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-300 mt-4">
                        Don’t have an account?{' '}
                        <Link
                            to="/sign-up"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                        >
                            Sign Up Now
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;