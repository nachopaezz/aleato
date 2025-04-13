import { useState, useCallback } from 'react';

const useTeamGenerator = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [numTeams, setNumTeams] = useState(2);
  const [teamSize, setTeamSize] = useState(2);

  const addPlayer = useCallback((name) => {
    setPlayers(prev => {
      if (prev.includes(name)) {
        return prev;
      }
      return [...prev, name];
    });
    return true;
  }, []);

  const removePlayer = useCallback((name) => {
    setPlayers(prev => prev.filter(player => player !== name));
  }, []);

  const getTotalPlayersNeeded = useCallback((teams, size) => {
    return teams * size;
  }, []);

  const getPlayersRemaining = useCallback((teams, size) => {
    const total = getTotalPlayersNeeded(teams, size);
    return Math.max(0, total - players.length);
  }, [players.length, getTotalPlayersNeeded]);

  const generateTeams = useCallback(() => {
    // Verificar que tenemos suficientes jugadores
    if (players.length === 0) return;
    
    // Copia y mezcla el array de jugadores
    const shuffledPlayers = [...players]
      .sort(() => Math.random() - 0.5);
    
    // Crear arrays vacíos para cada equipo
    const generatedTeams = [];
    for (let i = 0; i < numTeams; i++) {
      generatedTeams.push({
        name: `Equipo ${i + 1}`,
        players: []
      });
    }
    
    // Distribuir jugadores equitativamente
    let currentTeam = 0;
    shuffledPlayers.forEach(player => {
      generatedTeams[currentTeam].players.push(player);
      currentTeam = (currentTeam + 1) % numTeams;
    });

    // Actualizar el estado
    setTeams(generatedTeams);
  }, [players, numTeams]);

  const clearTeams = useCallback(() => {
    setTeams([]);
  }, []);

  return {
    players,
    teams,
    addPlayer,
    removePlayer,
    generateTeams,
    numTeams,
    setNumTeams: (value) => setNumTeams(Number(value)),
    teamSize,
    setTeamSize: (value) => setTeamSize(Number(value)),
    getPlayersRemaining,
    getTotalPlayersNeeded,
    clearTeams,
    setPlayers
  };
};

export default useTeamGenerator;
