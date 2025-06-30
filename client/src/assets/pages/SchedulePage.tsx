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

// Função auxiliar para obter uma cor de texto legível (preto ou branco)
const getTextColorForBackground = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Fórmula de luminância
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
};

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

      <div className="p-1 sm:p-6 bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="p-2 border border-gray-200 w-24 sm:w-32">Horário</th>
              {DAYS_OF_WEEK.map(day => (
                <th key={day.key} className="p-2 border border-gray-200 min-w-[100px] sm:min-w-[120px]">
                  {day.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(slot => (
              <tr key={slot}>
                <td className="p-2 border border-gray-200 font-mono text-xs sm:text-sm text-gray-600">
                  {slot}
                </td>
                {DAYS_OF_WEEK.map(day => {
                  // MUDANÇA AQUI: subject agora é um objeto {name, color}
                  const subjectBlock = schedule[day.key]?.[slot];

                  return (
                    <td key={day.key} className="p-1 border border-gray-200">
                      {subjectBlock ? (
                        <div 
                          className="w-full h-full p-2 rounded-md flex items-center justify-center font-semibold text-xs sm:text-sm"
                          style={{
                            backgroundColor: subjectBlock.color,
                            color: getTextColorForBackground(subjectBlock.color),
                          }}
                        >
                          {subjectBlock.name}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gray-50"></div>
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
  );
};

export default SchedulePage
