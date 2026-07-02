import React from 'react';

const StatusPanel = ({ state, isPaused, pause, resume }) => {
  return (
    <div className="status-panel border border-secondary p-3 bgcolor-secondary-25 h-100">
      <h3 className="fw-bold mb-3 text-center color-primary">Panneau de Contrôle</h3>

      <div className="mb-4">
        <div className="row mb-2 border-bottom border-secondary-50 pb-2">
          <div className="col-6 text-opacity-75">Étage Actuel :</div>
          <div className="col-6 fw-bold">{state.currentFloor === 0 ? 'RDC' : state.currentFloor}</div>
        </div>

        <div className="row mb-2 border-bottom border-secondary-50 pb-2">
          <div className="col-6 text-opacity-75">Direction :</div>
          <div className="col-6 fw-bold text-uppercase">{state.direction}</div>
        </div>

        <div className="row mb-2 border-bottom border-secondary-50 pb-2">
          <div className="col-6 text-opacity-75">En mouvement :</div>
          <div className="col-6 fw-bold">{state.isMoving ? 'Oui' : 'Non'}</div>
        </div>

        <div className="row mb-2 border-bottom border-secondary-50 pb-2">
          <div className="col-6 text-opacity-75">État Portes :</div>
          <div className="col-6 fw-bold text-uppercase">{state.doorState}</div>
        </div>

        <div className="row mb-2 border-bottom border-secondary-50 pb-2">
          <div className="col-6 text-opacity-75">File Montée (queueUp) :</div>
          <div className="col-6 fw-bold">[{state.queueUp.join(', ')}]</div>
        </div>

        <div className="row mb-2 border-bottom border-secondary-50 pb-2">
          <div className="col-6 text-opacity-75">File Descente (queueDown) :</div>
          <div className="col-6 fw-bold">[{state.queueDown.join(', ')}]</div>
        </div>

        <div className="row mb-2">
          <div className="col-6 text-opacity-75">Simulation en Pause :</div>
          <div className="col-6 fw-bold">{isPaused ? 'Oui' : 'Non'}</div>
        </div>
      </div>

      <div className="d-flex gap-2 mb-4">
        <button
          onClick={pause}
          disabled={isPaused}
          className="btn btn-outline-danger w-50"
        >
          Pause
        </button>
        <button
          onClick={resume}
          disabled={!isPaused}
          className="btn btn-outline-success w-50"
        >
          Reprendre
        </button>
      </div>

      <div className="border-top border-secondary pt-3">
        <h4 className="fw-bold fs-9s color-primary mb-2">Historique du parcours</h4>
        <div 
          className="bg-black p-2 border border-secondary text-truncate-2" 
          style={{ 
            fontSize: '0.85rem', 
            minHeight: '50px', 
            maxHeight: '80px', 
            overflowY: 'auto',
            wordBreak: 'break-all'
          }}
        >
          {state.history.length === 0 ? (
            <span className="text-secondary">Aucun déplacement</span>
          ) : (
            state.history.map((floor, idx) => (
              <span key={idx}>
                {floor === 0 ? 'RDC' : floor}
                {idx < state.history.length - 1 ? ' → ' : ''}
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
