import React from 'react';
import useElevator from './hooks/useElevator';
import Building from './components/Building';
import ElevatorCabin from './components/ElevatorCabin';
import StatusPanel from './components/StatusPanel';

const App = () => {
  const {
    state,
    isPaused,
    callFromFloor,
    selectDestination,
    pause,
    resume
  } = useElevator();

  return (
    <div className="container py-4">
      <header className="mb-4 text-center border-bottom border-secondary pb-3">
        <h1 className="fw-bold color-primary m-0">Simulateur d'Ascenseur</h1>
        <p className="text-secondary m-0 fs-9s">Test Technique - Simulation d'Algorithme SCAN</p>
      </header>

      <div className="row g-4">
        {/* Colonne Gauche : Immeuble */}
        <div className="col-12 col-md-5">
          <Building state={state} callFromFloor={callFromFloor} />
        </div>

        {/* Colonne Milieu : Panneau Interne */}
        <div className="col-12 col-md-4">
          <ElevatorCabin state={state} selectDestination={selectDestination} />
        </div>

        {/* Colonne Droite : Status */}
        <div className="col-12 col-md-3">
          <StatusPanel
            state={state}
            isPaused={isPaused}
            pause={pause}
            resume={resume}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
