import React, { useState, useCallback } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PlayerInput from './components/PlayerInput';
import TeamDisplay from './components/TeamDisplay';
import useTeamGenerator from './hooks/useTeamGenerator';
import './App.css';

const STEPS = {
  WELCOME: 'welcome',
  SETTINGS: 'settings',
  PLAYERS: 'players',
  RESULTS: 'results',
};

const formatName = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
};

const App = () => {
  const { 
    players,
    teams,
    addPlayer,
    removePlayer,
    generateTeams,
    numTeams,
    setNumTeams,
    teamSize,
    setTeamSize,
    getPlayersRemaining,
    getTotalPlayersNeeded,
    clearTeams,
    setPlayers
  } = useTeamGenerator();
  
  const [currentStep, setCurrentStep] = useState(STEPS.WELCOME);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  // Manejar agregar jugador
  const handleAddPlayer = (name) => {
    const formattedName = formatName(name);
    if (!formattedName) {
      toast.error('Por favor ingresa un nombre válido');
      return;
    }
    
    const totalNeeded = getTotalPlayersNeeded(numTeams, teamSize);
    const remaining = totalNeeded - players.length;
    
    if (remaining <= 0) {
      toast.warning('Ya se alcanzó el límite de jugadores');
      return;
    }

    if (players.includes(formattedName)) {
      toast.warning('Este jugador ya está en la lista');
      return;
    }

    if (addPlayer(formattedName)) {
      // Solo mostrar notificación en puntos clave
      const newRemaining = totalNeeded - (players.length + 1);
      if (newRemaining === Math.floor(totalNeeded / 2)) {
        toast.info(`¡Ya vas por la mitad! Faltan ${newRemaining} jugadores`);
      } else if (newRemaining === 1) {
        toast.info('¡Solo falta 1 jugador!');
      } else if (newRemaining === 0) {
        toast.success('¡Lista completa! Ya puedes generar los equipos');
      }
    }
  };

  // Manejar entrada en bloque
  const handleBulkInput = () => {
    const names = bulkInput
      .split('\n')
      .map(name => formatName(name))
      .filter(name => name.length > 0);

    if (names.length === 0) {
      toast.error('No se encontraron nombres válidos');
      return;
    }

    const totalNeeded = getTotalPlayersNeeded(numTeams, teamSize);
    const remainingSlots = totalNeeded - players.length;

    if (remainingSlots <= 0) {
      toast.warning('Ya se alcanzó el límite de jugadores');
      return;
    }

    let added = 0;
    const initialCount = players.length;
    
    for (const name of names) {
      if (added >= remainingSlots) break;
      if (!players.includes(name) && addPlayer(name)) {
        added++;
      }
    }

    if (added > 0) {
      const newTotal = initialCount + added;
      const remaining = totalNeeded - newTotal;
      
      // Notificaciones estratégicas para bulk input
      if (remaining === 0) {
        toast.success('¡Lista completa! Ya puedes generar los equipos');
      } else if (remaining <= Math.floor(totalNeeded / 2)) {
        toast.info(`¡Buen progreso! Solo faltan ${remaining} jugadores`);
      } else {
        toast.success(`Se agregaron ${added} jugadores`);
      }
      
      setBulkInput('');
    }
  };

  // Manejar generación de equipos
  const handleGenerateTeams = async () => {
    const totalNeeded = getTotalPlayersNeeded(numTeams, teamSize);
    if (players.length < totalNeeded) {
      toast.error(`Necesitas ${totalNeeded - players.length} jugadores más`);
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    generateTeams();
    setIsLoading(false);
    setCurrentStep(STEPS.RESULTS);
    toast.success('¡Equipos generados!');
  };

  // Manejar compartir
  const handleShare = async () => {
    const teamsText = formatTeamsText();
    if (!teamsText) return;
    
    try {
      await navigator.clipboard.writeText(teamsText);
      toast.success('¡Equipos copiados al portapapeles!');

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Equipos generados por Aleato',
            text: teamsText
          });
        } catch (err) {
          console.log('Share cancelled or failed');
        }
      }
    } catch (err) {
      toast.error('Error al copiar los equipos');
      console.error('Error al copiar:', err);
    }
  };

  const formatTeamsText = () => {
    if (!teams.length) return '';
    
    return teams
      .map(team => `${team.name}:\n${team.players.join('\n')}`)
      .join('\n\n');
  };

  const handleShareWhatsApp = () => {
    const teamsText = formatTeamsText();
    if (!teamsText) return;

    const encodedText = encodeURIComponent(teamsText);
    const whatsappUrl = `https://wa.me/?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
  };

  // Manejar eliminar jugador
  const handleRemovePlayer = (name) => {
    removePlayer(name);
    toast.info('Jugador eliminado');
  };

  // Manejar reset
  const handleReset = () => {
    // Limpiar equipos
    clearTeams();
    // Limpiar jugadores
    setPlayers([]);
    // Resetear número de equipos y tamaño
    setNumTeams(2);
    setTeamSize(2);
    // Volver al primer paso
    setCurrentStep(STEPS.SETTINGS);
    // Mostrar notificación
    toast.info('Configuración reiniciada');
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.WELCOME:
        return (
          <div className="welcome-screen">
            <h1>Aleato</h1>
            <p className="subtitle">Armá equipos aleatorios fácil y rápido</p>
            <button onClick={() => setCurrentStep(STEPS.SETTINGS)}>
              Comenzar
            </button>
          </div>
        );

      case STEPS.SETTINGS:
        return (
          <div className="settings-screen">
            <h2>Configuración de Equipos</h2>
            <div className="settings-form">
              <div className="setting-item">
                <label>
                  Número de equipos:
                  <input
                    type="number"
                    value={numTeams}
                    onChange={(e) => setNumTeams(e.target.value)}
                    min="2"
                    max="10"
                    required
                  />
                </label>
              </div>
              <div className="setting-item">
                <label>
                  Jugadores por equipo:
                  <input
                    type="number"
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    min="2"
                    max="11"
                    required
                  />
                </label>
              </div>
              <div className="total-players">
                Total de jugadores necesarios: {getTotalPlayersNeeded(numTeams, teamSize)}
              </div>
              <div className="navigation-buttons">
                <button onClick={() => setCurrentStep(STEPS.WELCOME)}>
                  Volver
                </button>
                <button onClick={() => setCurrentStep(STEPS.PLAYERS)}>
                  Continuar
                </button>
              </div>
            </div>
          </div>
        );

      case STEPS.PLAYERS:
        const playersRemaining = getPlayersRemaining(numTeams, teamSize);
        return (
          <div className="players-screen">
            <div className="progress-info">
              {playersRemaining > 0 ? (
                <>
                  <p>Faltan {playersRemaining} jugadores</p>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(players.length / getTotalPlayersNeeded(numTeams, teamSize)) * 100}%` 
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className="ready-message">¡Listo para generar equipos! 🎮</p>
              )}
            </div>

            <div className="input-sections">
              <PlayerInput 
                onAddPlayer={handleAddPlayer} 
                disabled={getPlayersRemaining(numTeams, teamSize) <= 0}
              />

              <div className="bulk-input">
                <h3>Agregar varios jugadores</h3>
                <textarea
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder="Un jugador por línea, por ejemplo:&#10;Juan Pérez&#10;María García&#10;Carlos López"
                  rows="5"
                  aria-label="Lista de jugadores"
                  disabled={getPlayersRemaining(numTeams, teamSize) <= 0}
                />
                <button 
                  onClick={handleBulkInput}
                  disabled={getPlayersRemaining(numTeams, teamSize) <= 0}
                >
                  Agregar Jugadores
                </button>
              </div>
            </div>

            {players.length > 0 && (
              <div className="players-list">
                <h3>Jugadores ({players.length})</h3>
                <div className="players-grid">
                  {players.map(player => (
                    <div key={player} className="player-item">
                      <span className="player-name">{player}</span>
                      <button 
                        className="remove-player"
                        onClick={() => handleRemovePlayer(player)}
                        title="Eliminar jugador"
                        aria-label={`Eliminar ${player}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="navigation-buttons">
              <button onClick={() => setCurrentStep(STEPS.SETTINGS)}>
                ← Volver
              </button>
              <button 
                onClick={handleGenerateTeams}
                disabled={playersRemaining > 0}
              >
                Generar Equipos →
              </button>
            </div>
          </div>
        );

      case STEPS.RESULTS:
        return (
          <div className="results-section">
            <TeamDisplay teams={teams} />
            
            <div className="actions">
              <button onClick={handleShare}>
                📋 Copiar Equipos
              </button>
              <button 
                onClick={handleShareWhatsApp}
                className="whatsapp-btn"
              >
                <span>📱 Compartir por WhatsApp</span>
              </button>
              <button onClick={handleReset}>
                🔄 Volver a Empezar
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Aleato</h1>
      </header>
      <main>
        {renderStep()}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-icon">🔄</div>
          <p>Generando equipos...</p>
        </div>
      )}
    </div>
  );
};

export default App;
