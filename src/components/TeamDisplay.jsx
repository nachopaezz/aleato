import React from 'react';
import './TeamDisplay.css';

const TeamDisplay = ({ teams }) => {
  if (!teams || teams.length === 0) {
    return null;
  }

  const teamColors = [
    '#2196F3', // Azul
    '#4CAF50', // Verde
    '#F44336', // Rojo
    '#FF9800', // Naranja
    '#9C27B0', // Púrpura
    '#00BCD4', // Cyan
    '#FF5722', // Naranja oscuro
    '#795548', // Marrón
    '#607D8B', // Azul grisáceo
    '#E91E63'  // Rosa
  ];

  return (
    <div className="teams-display">
      {teams.map((team, index) => (
        <div 
          key={team.name} 
          className="team-card"
          style={{ 
            '--team-color': teamColors[index % teamColors.length],
            animationDelay: `${index * 0.1}s`
          }}
        >
          <h3>{team.name}</h3>
          <ul>
            {team.players.map((player, playerIndex) => (
              <li key={`${team.name}-${playerIndex}`}>
                {player}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default TeamDisplay;
