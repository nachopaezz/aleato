import React, { useState, KeyboardEvent } from 'react';
import './PlayerInput.css';

interface PlayerInputProps {
  onAddPlayer: (name: string) => void;
  isAtLimit: boolean;
}

const PlayerInput = ({ onAddPlayer, isAtLimit }: PlayerInputProps) => {
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  const handleAddPlayer = () => {
    if (isAtLimit) {
      setError('Ya se alcanzó el límite de jugadores');
      return;
    }

    if (playerName.trim()) {
      onAddPlayer(playerName.trim());
      setPlayerName('');
      setError('');
    } else {
      setError('Por favor ingresa un nombre válido');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddPlayer();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (isAtLimit) {
      setError('Ya se alcanzó el límite de jugadores');
      return;
    }

    const pastedData = e.clipboardData.getData('text');
    const players = pastedData
      .split('\n')
      .map(name => name.trim())
      .filter(name => name);
    
    if (players.length > 0) {
      players.forEach(name => onAddPlayer(name));
      setPlayerName('');
      setError('');
    }
  };

  return (
    <div className="player-input">
      <div className="input-group">
        <input
          type="text"
          value={playerName}
          onChange={(e) => {
            setPlayerName(e.target.value);
            setError('');
          }}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
          placeholder={isAtLimit ? 'Límite de jugadores alcanzado' : 'Ingresa el nombre del jugador'}
          className={error ? 'error' : ''}
          disabled={isAtLimit}
        />
        <button onClick={handleAddPlayer} disabled={isAtLimit}>
          <span>+</span>
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <p className="help-text">
        Pro tip: Puedes pegar una lista de nombres y se agregarán automáticamente
      </p>
    </div>
  );
};

export default PlayerInput;
