import { BrowserRouter, Routes, Route } from 'react-router-dom';

import SetupPage from './assets/pages/SetupPage';
import SchedulePage from './assets/pages/SchedulePage';

import './App.css'

function App() {
  return (
    <BrowserRouter>
      <main className="bg-gray-100 min-h-screen text-gray-800">
        <Routes>
          <Route path="/" element={<SetupPage />}/>
          <Route path="/cronograma" element={<SchedulePage />}/>
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;