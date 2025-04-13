import { useState, useCallback } from 'react';

const useTeamGenerator = () => {
  const [players, setPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);

  const addPlayer = useCallback((name: string) => {
    setPlayers((prev) => {
      // Evitar duplicados
      if (prev.includes(name)) {
        return prev;
      }
      return [...prev, name];
    });
  }, []);

  const removePlayer = useCallback((name: string) => {
    setPlayers((prev) => prev.filter(player => player !== name));
  }, []);

  const getTotalPlayersNeeded = useCallback((numTeams: number, teamSize: number) => {
    return numTeams * teamSize;
  }, []);

  const getPlayersRemaining = useCallback((numTeams: number, teamSize: number) => {
    const total = getTotalPlayersNeeded(numTeams, teamSize);
    return Math.max(0, total - players.length);
  }, [players.length, getTotalPlayersNeeded]);

  const generateTeams = useCallback((teamSize: number, numTeams?: number) => {
    const shuffledPlayers = [...players].sort(() => Math.random() - 0.5);
    const newTeams: string[][] = [];

    if (numTeams) {
      // Si se especifica el número de equipos, distribuir jugadores equitativamente
      const playersPerTeam = Math.ceil(shuffledPlayers.length / numTeams);
      
      for (let i = 0; i < numTeams; i++) {
        const start = i * playersPerTeam;
        const end = start + playersPerTeam;
        newTeams.push(shuffledPlayers.slice(start, end));
      }
    } else {
      // Si se especifica el tamaño del equipo, crear equipos de ese tamaño
      for (let i = 0; i < shuffledPlayers.length; i += teamSize) {
        newTeams.push(shuffledPlayers.slice(i, i + teamSize));
      }
    }

    setTeams(newTeams);
  }, [players]);

  const reshuffleTeams = useCallback(() => {
    if (teams.length === 0) return;

    const allPlayers = teams.flat();
    const shuffledPlayers = [...allPlayers].sort(() => Math.random() - 0.5);
    const newTeams: string[][] = [];

    // Mantener el mismo número de jugadores por equipo que antes
    teams.forEach((team, index) => {
      const start = index * team.length;
      const end = start + team.length;
      newTeams.push(shuffledPlayers.slice(start, end));
    });

    setTeams(newTeams);
  }, [teams]);

  const clearTeams = useCallback(() => {
    setTeams([]);
  }, []);

  const clearPlayers = useCallback(() => {
    setPlayers([]);
    setTeams([]);
  }, []);

  return {
    players,
    teams,
    addPlayer,
    removePlayer,
    generateTeams,
    reshuffleTeams,
    clearTeams,
    clearPlayers,
    getTotalPlayersNeeded,
    getPlayersRemaining,
  };
};

export default useTeamGenerator;
