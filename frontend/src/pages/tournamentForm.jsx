import React, { useState } from 'react';
import { createTournament } from '../api/tounamentAPI';
import { useNavigate } from 'react-router-dom';
import {uploadImageTournamentAndPlayer}  from '../api/imageAPI';

const NewTournamentForm = () => {
  const navigate = useNavigate();
  const [tournamentData, setTournamentData] = useState({
    logo: null,
    name: '',
    time_start: '',
    location: '',
    description: '',
    format: 'Round Robin',
    number_of_member: 5,
    number_of_rounds: 1,
    number_of_team_advances: 2,
    number_of_teams: 4,
    number_of_group: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTournamentData({
      ...tournamentData,
      [name]: value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setTournamentData({...tournamentData, logo: file});
      };
      reader.readAsDataURL(file);
    } else {
      setLogoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = JSON.parse(localStorage.getItem('user')) || {};


    try {
      const id = `tournament_${Date.now()}`;
      console.log("Loading", tournamentData.logo);
     
        const logoUrl = await uploadImageTournamentAndPlayer(id, tournamentData.logo);
      

      const defaultedData = {
        ...tournamentData,
        logo: logoUrl,
        number_of_member: tournamentData.number_of_member || 1,
        number_of_rounds: tournamentData.number_of_rounds || 1,
        number_of_team_advances: tournamentData.number_of_team_advances || 1,
        number_of_teams: tournamentData.number_of_teams || 1,
        number_of_group: tournamentData.number_of_group || 1,
        createdBy: user.id || null,
      };

      console.log("hello: ", defaultedData );
      
      await createTournament(defaultedData);
      setShowSuccess(true);
      setTimeout(() => {
        navigate('/tournaments');
      }, 2000);
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (e) => {
    const { value } = e.target;
    setTournamentData({
      ...tournamentData,
      time_start: value,
    });
  };

  const isGroupStage = tournamentData.format === 'Group Stage';
  const isRoundRobin = tournamentData.format === 'Round Robin';

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4 flex items-start justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent animate-pulse-slow"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      {showSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-400/50 backdrop-blur-sm">
            <span className="text-xl">✅</span>
            <span className="font-medium">Tournament Created Successfully!</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-3xl bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-8 mt-6 transform transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] border border-gray-700/50">
        <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-12 flex items-center justify-center gap-4">
          <span className="text-6xl animate-bounce">🏆</span>
          Create Your Tournament
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tournament Logo */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Tournament Banner
            </label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
              />
              {logoPreview ? (
                <div className="relative w-full h-48 bg-gray-700/50 rounded-xl overflow-hidden shadow-lg border-2 border-blue-500/50 group-hover:border-blue-500 transition-all duration-300">
                  <img
                    src={logoPreview}
                    alt="Tournament Banner Preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                  <span className="absolute bottom-2 left-4 text-white text-lg font-semibold drop-shadow-md">
                    Tournament Banner Preview
                  </span>
                </div>
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-600 text-gray-400 text-lg font-medium shadow-inner transition-all duration-300 group-hover:border-blue-500/50">
                  Upload a banner (Recommended: 600x200px)
                </div>
              )}
            </div>
          </div>

          {/* Tournament Name */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Tournament Name
            </label>
            <input
              type="text"
              name="name"
              value={tournamentData.name}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20"
              placeholder="Enter tournament name"
            />
          </div>

          {/* Start Date */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Start Date
            </label>
            <input
              type="date"
              name="time_start"
              value={tournamentData.time_start}
              onChange={handleDateChange}
              className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20"
              required
            />
          </div>

          {/* Location */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={tournamentData.location}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20"
              placeholder="Enter location"
            />
          </div>

          {/* Description */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Description
            </label>
            <textarea
              name="description"
              value={tournamentData.description}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20 min-h-[140px] resize-y"
              placeholder="Describe your tournament"
            />
          </div>

          {/* Format */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Format
            </label>
            <div className="relative">
              <select
                name="format"
                value={tournamentData.format}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20 appearance-none"
              >
                <option value="Round Robin">Round Robin</option>
                <option value="Group Stage">Group Stage</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 pointer-events-none">▼</span>
            </div>
          </div>

          {/* Number of Members */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Members per Team
            </label>
            <input
              type="number"
              name="number_of_member"
              value={tournamentData.number_of_member}
              onChange={handleChange}
              min="1"
              required
              className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20"
            />
          </div>

          {/* Group Stage Specific */}
          {isGroupStage && (
            <>
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                  Teams Advancing
                </label>
                <div className="relative">
                  <select
                    name="number_of_team_advances"
                    value={tournamentData.number_of_team_advances}
                    onChange={handleChange}
                    required={isGroupStage}
                    className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20 appearance-none"
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-400 pointer-events-none">▼</span>
                </div>
              </div>

              <div className="relative group">
                <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
                  Number of Groups
                </label>
                <input
                  type="number"
                  name="number_of_group"
                  value={tournamentData.number_of_group}
                  onChange={handleChange}
                  min="1"
                  required={isGroupStage}
                  className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20"
                />
              </div>
            </>
          )}

          {/* Number of Teams */}
          <div className="relative group">
            <label className="block text-sm font-medium text-gray-300 mb-2 group-hover:text-blue-400 transition-colors duration-200">
              Number of Teams
            </label>
            <input
              type="number"
              name="number_of_teams"
              value={tournamentData.number_of_teams}
              onChange={handleChange}
              min="1"
              required
              className="w-full px-5 py-3 bg-gray-700/70 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white hover:bg-gray-700/90 shadow-sm hover:shadow-blue-500/20"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg ${
              isSubmitting ? 'animate-pulse' : 'hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Tournament...
              </span>
            ) : (
              'Create Tournament'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTournamentForm;