import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import SignUp from './pages/signUp';
import SignIn from './pages/signIn';
import NewTournamentForm from './pages/tournamentForm';
import TournamentDetails from './pages/tournamentGroups';
import TournamentInformation from './pages/tournamentInfo';
import TournamentList from './pages/tournamentList';
import ManageTournament from './pages/manageTournament';
import ClubsDetails from './pages/teams';
import ClubForm from './pages/clubForm';
import TeamDetail from './pages/teamDetail';
import ManageClub from './pages/manageClub';
import UserProfile from './pages/userProfile';
// Tournament Bracket Components
import RoundOf32 from './components/roundOf32';
import RoundOf16 from './components/roundOf16';
import QuarterFinals from './components/quarterFinals';
import SemiFinals from './components/semiFinals';
import Final from './components/final';
import TestBrackets from './components/testBrackets';
import GetGroups from './components/gettingGroupTabs';
import DisExample from './components/Disclosure';

function ComponentWithTournamentId({ component: Component }) {
    const { id } = useParams();
    return <Component tournamentId={id} />;
}

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                <Route path="/me" element={<UserProfile />} />

                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/tournaments" element={<TournamentDetails />} />
                        <Route path="/clubs" element={<ClubsDetails />} />
                        <Route path="/tournament/:id" element={<TournamentInformation />} />
                        <Route path="/club/:id" element={<TeamDetail />} />
                        <Route path="/manage-tournaments/:id" element={<ManageTournament />} />


                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/new-club" element={<ClubForm />} />
                            <Route path="/manage-clubs" element={<ManageClub />} />
                            <Route path="/tournaments-list" element={<TournamentList />} />
                            <Route path="/new-tournament" element={<NewTournamentForm />} />
                            {/* Bracket Routes with tournamentId */}
                            <Route path="/:id/test" element={<ComponentWithTournamentId component={TestBrackets} />} />
                            <Route path="/:id/groups" element={<ComponentWithTournamentId component={GetGroups} />} />
                            <Route path="/:id/round32" element={<ComponentWithTournamentId component={RoundOf32} />} />
                            <Route path="/:id/round16" element={<ComponentWithTournamentId component={RoundOf16} />} />
                            <Route path="/:id/quarterfinals" element={<ComponentWithTournamentId component={QuarterFinals} />} />
                            <Route path="/:id/semifinals" element={<ComponentWithTournamentId component={SemiFinals} />} />
                            <Route path="/:id/final" element={<ComponentWithTournamentId component={Final} />} />
                        </Route>

                        {/* Testing Route (could be protected or public based on needs) */}
                        <Route path="/testing" element={<DisExample tournamentId="89" />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;