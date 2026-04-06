import { BrowserRouter, Route, Routes } from 'react-router';
import './App.css';
import Home from '@/pages/Home/Home';
import Lobby from '@/pages/Lobby/Lobby';
import FindLobby from '@/pages/Lobby/FindLobby';
import CreateLobby from '@/pages/Lobby/CreateLobby';
import Play from './pages/Play/Play';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />}/>
        <Route path='lobby/:lobbyId' element={<Lobby />}/>
        <Route path='createLobby' element={<CreateLobby />}/>
        <Route path='findLobby' element={<FindLobby />}/>
        <Route path='lobby/:lobbyId/play' element={<Play />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
