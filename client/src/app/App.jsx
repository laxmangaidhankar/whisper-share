import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import JoinRoom from '../pages/JoinRoom';
import CreateRoom from '../pages/CreateRoom';
import LandingPage from '../pages/LandingPage';
import InstantUpload from '../pages/InstantUpload';

import WhisperShareHome from '../pages/WhisperShareHome';
import LiveRoom from '../pages/LiveRoom';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/join-room" element={<JoinRoom />} />

        <Route path="/instant-upload" element={<InstantUpload />} />

        <Route path="/dashboard" element={<WhisperShareHome />} />

        <Route path="/room" element={<LiveRoom />} />

        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/create-room/name" element={<CreateRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;