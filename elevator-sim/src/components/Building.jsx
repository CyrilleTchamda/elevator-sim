import React from 'react';

const Building = ({ state, callFromFloor }) => {
  const floors = Array.from({ length: 10 }, (_, i) => 9 - i);

  const getFloorLabel = (floor) => {
    if (floor === 0) return 'RDC';
    return `${floor}e`;
  };

  return (
    <div className="building border border-secondary p-3 bgcolor-secondary-25">
      <h3 className="fw-bold mb-3 text-center color-primary">Immeuble</h3>
      <div className="d-flex flex-column gap-2">
        {floors.map((floor) => {
          const isCurrent = state.currentFloor === floor;
          const hasUpRequest = state.queueUp.includes(floor);
          const hasDownRequest = state.queueDown.includes(floor);
          const isRequested = hasUpRequest || hasDownRequest;

          return (
            <div
              key={floor}
              className="d-flex align-items-center justify-content-between p-2 border-bottom border-secondary-50 floor-row"
              style={{ minHeight: '60px' }}
            >
              <div className="fw-bold" style={{ width: '60px' }}>
                {getFloorLabel(floor)}
              </div>

              <div className="flex-grow-1 d-flex justify-content-center">
                {isCurrent && (
                  <div className="elevator-cab px-3 py-2 bgcolor-primary text-white fw-bold border border-light">
                    CABINE ({state.doorState === 'open' ? 'Portes Ouvertes' : 'Portes Fermées'})
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => callFromFloor(floor)}
                  disabled={isCurrent && state.doorState === 'open'}
                  className={`btn btn-sm ${isRequested ? 'btn-warning' : 'btn-outline-primary'}`}
                >
                  {isRequested ? 'Appelé' : 'Appeler'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Building;
