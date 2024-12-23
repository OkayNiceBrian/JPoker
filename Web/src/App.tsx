import { BrowserRouter, Route, Routes } from 'react-router';
import Game from './components/Game/Game';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Game />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
