import React from 'react';
import './TeamDisplay.css';

const TeamDisplay = ({ teams }) => {
  const teamColors = [
    '#2196f3', // blue
    '#f44336', // red
    '#4caf50', // green
    '#ff9800', // orange
    '#9c27b0', // purple
    '#795548', // brown
  ];

  return (
    <div className="teams-container">
      {teams.map((team, index) => (
        <div
          key={index}
          className="team-card"
          style={{
            '--team-color': teamColors[index % teamColors.length]
          } as React.CSSProperties}
        >
          <div className="team-header">
            <h2>Equipo {index + 1}</h2>
            <span className="player-count">{team.length} jugadores</span>
          </div>
          <ul className="player-list">
            {team.map((player, i) => (
              <li key={i} className="player-item">
                <span className="player-number">{i + 1}</span>
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