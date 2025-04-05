import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { createTeam } from '../api/teamAPI';
import { CheckCircleIcon, XCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import { SketchPicker } from 'react-color';
import { useNavigate } from "react-router-dom";
import { uploadImageClub } from '../api/imageAPI';

function ClubForm() {
    const navigate = useNavigate();
    const [clubData, setClubData] = useState({
        image_cover: null,
        logo: null,
        imagePreview: '',
        logoPreview: '',
        name: '',
        contact_person_name: '',
        location: '',
        jersey_color: ['#FFFFFF'],
        description: '',
        facebook_link: '',
        instagram_link: '',
        members: 0,
        phone: '',
        createdBy: JSON.parse(localStorage.getItem('user'))?.id || null,
    });
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentColorIndex, setCurrentColorIndex] = useState(0);
    const colorPickerRef = useRef(null);
    const [isSubmitting, setIsSubmiting] = useState(false);

    const hideErrorContainer = () => {
        const errorContainer = document.getElementById('error-container');
        const successContainer = document.getElementById('success-container');
        if (errorContainer) errorContainer.style.display = 'none';
        if (successContainer) successContainer.style.display = 'none';
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setClubData({ ...clubData, image_cover: file, imagePreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setClubData({ ...clubData, logo: file, logoPreview: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmiting(true);
        try {
            const id = `club_${Date.now()}`;
            let imageUrl = '';
            let logoUrl = '';

            if (clubData.image_cover) {
                imageUrl = await uploadImageClub(id, 'image', clubData.image_cover);
                console.log(imageUrl);
            }
            if (clubData.logo) {
                logoUrl = await uploadImageClub(id, 'logo', clubData.logo);
                console.log(logoUrl);
            }

            const { imagePreview, logoPreview, ...rest } = clubData;
            const clubPayload = {
                ...rest,
                image_cover: imageUrl,
                logo: logoUrl,
            };

            console.log("Club Payload: ", JSON.stringify(clubPayload, null, 2)); // In dữ liệu gửi đi
            const token = localStorage.getItem('token');
            await createTeam(clubPayload, token);

            document.getElementById('success-message').textContent = 'New club is successfully created.';
            document.getElementById('success-container').style.display = 'flex';
            setClubData({
                image_cover: null,
                logo: null,
                imagePreview: '',
                logoPreview: '',
                name: '',
                contact_person_name: '',
                location: '',
                jersey_color: ['#FFFFFF'],
                description: '',
                facebook_link: '',
                instagram_link: '',
                members: 0,
                phone: '',
                createdBy: JSON.parse(localStorage.getItem('user'))?.id || null,
            });
        } catch (error) {
            console.error('Error creating club:', error);
            if (error.response?.status === 409) {
                alert("You already have a club");
                document.getElementById('error-message').textContent = 'You already have a team!';
                document.getElementById('error-container').style.display = 'flex';
                navigate('/manage-clubs');
            } else {
                document.getElementById('error-message').textContent =
                    error.response?.data?.message || 'An error occurred. Please try again.';
                document.getElementById('error-container').style.display = 'flex';
            }
        }
        finally {
            setIsSubmiting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClubData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleColorChange = (color) => {
        const newColors = [...clubData.jersey_color];
        newColors[currentColorIndex] = color.hex;
        setClubData({ ...clubData, jersey_color: newColors });
    };

    const addColor = () => {
        setClubData({ ...clubData, jersey_color: [...clubData.jersey_color, '#FFFFFF'] });
    };

    const removeColor = (index) => {
        const newColors = clubData.jersey_color.filter((_, i) => i !== index);
        setClubData({ ...clubData, jersey_color: newColors });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
                setShowColorPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-8 flex items-center justify-center">
            <div className="w-full max-w-6xl bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700">
                <h1 className="text-5xl font-extrabold text-white text-center mb-10 drop-shadow-lg">
                    Build Your Club
                </h1>

                <div id="success-container" className="hidden items-center gap-4 p-6 mb-8 bg-green-500/10 border border-green-500/30 rounded-lg shadow-md">
                    <CheckCircleIcon className="h-8 w-8 text-green-400" onClick={hideErrorContainer} />
                    <p id="success-message" className="text-green-300 text-lg font-semibold"></p>
                </div>
                <div id="error-container" className="hidden items-center gap-4 p-6 mb-8 bg-red-500/10 border border-red-500/30 rounded-lg shadow-md">
                    <XCircleIcon className="h-8 w-8 text-red-400" onClick={hideErrorContainer} />
                    <p id="error-message" className="text-red-300 text-lg font-semibold"></p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Club Image *</label>
                            <div className="relative h-64 w-full rounded-lg border-2 border-dashed border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 shadow-inner transition-all duration-300 flex items-center justify-center overflow-hidden group">
                                {clubData.imagePreview ? (
                                    <img src={clubData.imagePreview} alt="Club Preview" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                ) : (
                                    <span className="text-gray-400 text-lg font-medium">Drop or Click to Upload</span>
                                )}
                                <input type="file"
                                 className="absolute inset-0 opacity-0 cursor-pointer" 
                                onChange={handleImageChange} />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Club Logo *</label>
                            <div className="relative h-64 w-full rounded-lg border-2 border-dashed border-gray-600 bg-gray-700/50 hover:bg-gray-600/50 shadow-inner transition-all duration-300 flex items-center justify-center overflow-hidden group">
                                {clubData.logoPreview ? (
                                    <img src={clubData.logoPreview} alt="Club Logo" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                ) : (
                                    <span className="text-gray-400 text-lg font-medium">Drop or Click to Upload</span>
                                )}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoChange} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Club Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={clubData.name}
                                onChange={handleChange}
                                placeholder="Enter club name..."
                                className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Contact Name *</label>
                            <input
                                type="text"
                                name="contact_person_name"
                                value={clubData.contact_person_name}
                                onChange={handleChange}
                                placeholder="Enter contact name..."
                                className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Activity Area *</label>
                            <input
                                type="text"
                                name="location"
                                value={clubData.location}
                                onChange={handleChange}
                                placeholder="Enter activity area..."
                                className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                required
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Phone *</label>
                            <input
                                type="text"
                                name="phone"
                                value={clubData.phone}
                                onChange={handleChange}
                                placeholder="Enter number phone..."
                                className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Facebook Link</label>
                            <input
                                type="url"
                                name="facebook_link"
                                value={clubData.facebook_link}
                                onChange={handleChange}
                                placeholder="Enter Facebook link..."
                                className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-base font-semibold text-gray-300">Instagram Link</label>
                            <input
                                type="url"
                                name="instagram_link"
                                value={clubData.instagram_link}
                                onChange={handleChange}
                                placeholder="Enter Instagram link..."
                                className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-base font-semibold text-gray-300">Jersey Colors *</label>
                        {clubData.jersey_color.map((color, index) => (
                            <div key={index} className="relative flex items-center gap-4">
                                <div
                                    className="w-full p-4 rounded-lg bg-gray-700 border border-gray-600 flex items-center gap-4 cursor-pointer hover:bg-gray-600 transition-all duration-300"
                                    onClick={() => {
                                        setCurrentColorIndex(index);
                                        setShowColorPicker(!showColorPicker);
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-full border-2 border-gray-600 shadow-inner" style={{ backgroundColor: color }}></div>
                                    <span className="text-gray-300 font-medium">{color}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            removeColor(index);
                                        }}
                                        className="ml-auto p-2 hover:bg-red-500/30 rounded-full transition-all duration-300 transform hover:scale-110"
                                    >
                                        <TrashIcon className="h-6 w-6 text-red-400" />
                                    </button>
                                </div>
                                {showColorPicker && currentColorIndex === index && (
                                    <div className="absolute z-30 mt-2 top-full left-0 shadow-2xl" ref={colorPickerRef}>
                                        <SketchPicker
                                            color={color}
                                            onChangeComplete={handleColorChange}
                                            presetColors={[
                                                '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF',
                                                '#C0C0C0', '#808080', '#800000', '#808000', '#008000', '#800080',
                                                '#008080', '#000080', '#FFFFFF', '#000000'
                                            ]}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addColor}
                            className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            Add Color
                        </button>
                    </div>

                    <div className="space-y-4">
                        <label className="text-base font-semibold text-gray-300">Club Description</label>
                        <textarea
                            name="description"
                            value={clubData.description}
                            onChange={handleChange}
                            placeholder="Enter club description..."
                            className="w-full h-40 p-4 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 resize-y"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg ${isSubmitting ? 'animate-pulse' : 'hover:from-blue-600 hover:to-purple-700'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    />
                                </svg>
                                Creating Club...
                            </span>
                        ) : (
                            'Create Club'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ClubForm;