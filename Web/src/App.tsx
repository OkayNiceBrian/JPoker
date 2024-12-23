import { BrowserRouter, Route, Routes } from 'react-router';
import Play from './pages/Play/Play';
import './App.css';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Play />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
