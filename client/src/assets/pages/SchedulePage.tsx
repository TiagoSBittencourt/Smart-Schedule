import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import type { GeneratedSchedule } from '../types';

// After, move this const to a separete file (good practice)
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

function SchedulePage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Extract the data from navigation 'state'
    const schedule: GeneratedSchedule | undefined  = location.state?.schedule;

    useEffect(() => {
        if (!schedule) {
            console.log("Nenhum daado de cronograma, redireciondo ->>> ");
            navigate("/");
        }
    }, [schedule, navigate]);

    if (!schedule) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p>Carregando cronograma...</p>
            </div>
        )
    }


  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">
        Seu Cronograma de Estudos
      </h1>

      <div className="p-6 bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="p-2 border border-gray-200 w-32">Horário</th>
              {DAYS_OF_WEEK.map(day => (
                <th key={day.key} className="p-2 border border-gray-200 min-w-[120px]">
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(slot => (
              <tr key={slot}>
                <td className="p-2 border border-gray-200 font-mono text-sm text-gray-600">
                  {slot}
                </td>
                {DAYS_OF_WEEK.map(day => {
                  // Busca a matéria para o dia e horário específico
                  const subject = schedule[day.key]?.[slot];

                  return (
                    <td key={day.key} className={`p-2 border border-gray-200 transition-colors ${
                      subject ? 'bg-blue-100' : 'bg-gray-50'
                    }`}>
                      {subject ? (
                        <div className="font-semibold text-blue-800 text-sm">
                          {subject}
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="text-center mt-8">
        <Link 
          to="/"
          className="bg-green-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-green-600 transition-colors text-lg"
        >
          Criar Novo Cronograma
        </Link>
      </div>
    </div>
  )
}

export default SchedulePage
