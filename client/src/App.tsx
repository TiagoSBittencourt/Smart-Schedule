import './App.css'
import SetupPage from './assets/pages/SetupPage'; // for some reason ./pages/SetupPage is not working

function App() {
  return (
    <main className="bg-gray-100 min-h-screen text-gray-800">
      <SetupPage />
      {/* Mais tarde, adicionaremos o React Router para alternar entre as páginas */}
    </main>
  );
}

export default App;