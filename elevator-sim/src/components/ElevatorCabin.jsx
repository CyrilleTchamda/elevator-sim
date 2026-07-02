import React from 'react';

const ElevatorCabin = ({ state, selectDestination }) => {
  const floors = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="elevator-cabin border border-secondary p-3 bgcolor-secondary-25">
      <h3 className="fw-bold mb-3 text-center color-primary">Commandes Cabine</h3>

      <div className="mb-3 text-center">
        <div className="fs-9s mb-1">État des Portes</div>
        <div className="fw-bold text-uppercase border p-2 mb-3">
          {state.doorState === 'open' ? 'Ouvertes' : 'Fermées'}
        </div>

        <div className="fs-9s mb-1">Direction</div>
        <div className="fw-bold text-uppercase border p-2">
          {state.direction === 'idle' && 'À l\'arrêt'}
          {state.direction === 'up' && 'Montée ↑'}
          {state.direction === 'down' && 'Descente ↓'}
        </div>
      </div>

      <div className="fs-9s mb-2 text-center">Sélection Étage</div>
      <div className="d-grid gap-2" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {floors.map((floor) => {
          const isSelected = state.queueUp.includes(floor) || state.queueDown.includes(floor);
          const isCurrent = state.currentFloor === floor;

          return (
            <button
              key={floor}
              onClick={() => selectDestination(floor)}
              className={`btn py-2 fw-bold ${
                isCurrent
                  ? 'btn-secondary'
                  : isSelected
                  ? 'btn-warning'
                  : 'btn-outline-primary'
              }`}
            >
              {floor === 0 ? 'RDC' : floor}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ElevatorCabin;
