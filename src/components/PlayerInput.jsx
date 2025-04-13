import React, { useState } from 'react';

const PlayerInput = ({ onAddPlayer, disabled }) => {
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim() && !disabled) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !disabled) {
      handleSubmit(e);
    }
  };

  return (
    <div className="single-player-input">
      <h3>Agregar jugador</h3>
      <div className="input-container">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nombre del jugador..."
          aria-label="Nombre del jugador"
          disabled={disabled}
        />
        <button
          className="add-player-btn"
          onClick={handleSubmit}
          aria-label="Agregar jugador"
          title="Agregar jugador"
          disabled={disabled || !playerName.trim()}
        >
          +
        </button>
      </div>
      {disabled && (
        <p className="input-message">Ya se alcanzó el límite de jugadores</p>
      )}
    </div>
  );
};

export default PlayerInput;
