import React, { useState } from 'react';

// Types
import type { Subject, Availability, GeneratedSchedule } from '../types';

// API's call methods
import { generateSchedule } from '../api/scheduleApi';

// Icons
import { FaTrash } from 'react-icons/fa';

// Navigation
import { useNavigate } from 'react-router-dom';

// --- Consts to generate the schedule ---
const DAYS_OF_WEEK = [
  { key: 'segunda', label: 'Segunda' },
  { key: 'terca', label: 'Terça' },
  { key: 'quarta', label: 'Quarta' },
  { key: 'quinta', label: 'Quinta' },
  { key: 'sexta', label: 'Sexta' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
];

const TIME_SLOTS = [
  '08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00',
  '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00',
  '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00',
];
// ---------------------------------------------


const SetupPage: React.FC = () => {
  // --- States for user Iput ---
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectWeight, setNewSubjectWeight] = useState(3);
  const [availability, setAvailability] = useState<Availability>({});
  const [newSubjectColor, setNewSubjectColor] = useState('#4298e1')
  
  // States for feedback to user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigation
  const navigate = useNavigate();

  // --- Method to manipulate Classes ---
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault(); // Block the page reaload (HTML always reload after sending a form)
    if (newSubjectName.trim() === '') {
      alert('O nome da matéria não pode ser vazio.');
      return;
    }
    const newSubject: Subject = {
      id: crypto.randomUUID(), 
      name: newSubjectName.trim(),
      weight: newSubjectWeight,
      color: newSubjectColor,
    };
    setSubjects([...subjects, newSubject]);

    // Clean Forms Fields
    setNewSubjectName('');
    setNewSubjectWeight(3);
    setNewSubjectColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')); // Set a new random color
  };

  const handleRemoveSubject = (idToRemove: string) => {
    setSubjects(subjects.filter(subject => subject.id !== idToRemove));
  };

  // --- Method to manipulate the schedule ---
  const handleTimeSlotToggle = (dayKey: string, slot: string) => {
    // Create a new variable to not modify the state directly (Good Practice)
    const newAvailability = { ...availability };
    
    // Select only the selected slots on the day
    const daySlots = newAvailability[dayKey] || []; 

    if (daySlots.includes(slot)) {
      // If the slot was already select deselect it
      newAvailability[dayKey] = daySlots.filter(s => s !== slot);
    } else {
      // If not, add to selected slots
      newAvailability[dayKey] = [...daySlots, slot];
    }
    setAvailability(newAvailability);
  };
  
  // --- Method to call the API ---
  const handleGenerateClick = async () => {
    setLoading(true);
    setError(null);
    try {
      if (subjects.length === 0) {
        throw new Error("Adicione pelo menos uma matéria.");
      }
      if (Object.values(availability).every(slots => slots.length === 0)) {
        throw new Error("Selecione pelo menos um horário disponível.");
      }

      const payload = {
        subjects: subjects.map(({ id, ...rest }) => rest), // Remove the 'id' before send payload
        availability
      };
      
      const schedule: GeneratedSchedule = await generateSchedule(payload);
      console.log('Cronograma Gerado:', schedule);

      navigate("/cronograma", { state: { schedule }})
      
      // PROXIMO PASSO: Navegar para a pagina de visualizacao com os dados do 'schedule'    TODO: !!!!!
      alert('Cronograma gerado com sucesso! Veja o console.');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
      console.error(error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">Calendário de Estudos Inteligente</h1>
      
      {/* Div 1: Classes and Weights */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">1. Matérias e Prioridades</h2>
        
        {/* Classes Form */}
        <form onSubmit={handleAddSubject} className="flex flex-col md:flex-row gap-4 mb-6 items-center">
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Nome da Matéria"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <select
            value={newSubjectWeight}
            onChange={(e) => setNewSubjectWeight(Number(e.target.value))}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white md:w-52"
          >
            <option value={1}>Prioridade 1 (Baixa)</option>
            <option value={2}>Prioridade 2</option>
            <option value={3}>Prioridade 3 (Média)</option>
            <option value={4}>Prioridade 4</option>
            <option value={5}>Prioridade 5 (Alta)</option>
          </select>
          <input
            type="color"
            value={newSubjectColor}
            onChange={(e) => setNewSubjectColor(e.target.value)}
            className="w-full md:w-auto h-12 p-1 border border-gray-300 rounded-lg cursor-pointer"
            title="Escolha uma cor para a matéria"
          />
          <button type="submit" className="bg-green-500 text-white font-bold p-3 rounded-lg hover:bg-green-600 transition-colors h-12">
            Adicionar
          </button>
        </form>

        {/* Lista de matérias adicionadas */}
        <div className="space-y-3">
          {subjects.map(subject => (
            <div key={subject.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: subject.color }}></div>
                <span className="font-medium text-gray-700">{subject.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Peso: {subject.weight}</span>
                <button onClick={() => handleRemoveSubject(subject.id)} className="text-red-500 hover:text-red-700">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
          {subjects.length === 0 && <p className="text-center text-gray-500">Nenhuma matéria adicionada ainda.</p>}
        </div>
      </div>

      {/* Div 2: Availability Grid */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">2. Horários Disponíveis</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center">
            <thead>
              <tr>
                <th className="p-2 border border-gray-200">Horário</th>
                {DAYS_OF_WEEK.map(day => (
                  <th key={day.key} className="p-2 border border-gray-200 min-w-[100px]">{day.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map(slot => (
                <tr key={slot}>
                  <td className="p-2 border border-gray-200 font-mono text-sm text-gray-600">{slot}</td>
                  {DAYS_OF_WEEK.map(day => {
                    const isSelected = availability[day.key]?.includes(slot);
                    return (
                      <td key={day.key} className="p-1 border border-gray-200">
                        <div
                          onClick={() => handleTimeSlotToggle(day.key, slot)}
                          className={`w-full h-full p-4 rounded-md cursor-pointer transition-colors ${
                            isSelected ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                          aria-label={`Selecionar ${day.label}, ${slot}`}
                        >
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Generate Schedule Button */}
      <div className="text-center">
        {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
        <button
          onClick={handleGenerateClick}
          disabled={loading}
          className="w-full max-w-md mx-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Gerando...' : 'Gerar Meu Plano de Estudos!'}
        </button>
      </div>
    </div>
  );
};

export default SetupPage;