

// ######## CONSTANTES ########

const MIN_FLOOR = 0;
const MAX_FLOOR = 9;



// ######## ETAT INITIAL ########

const createInitialElevatorState = () => ({
    currentFloor: 0,
    direction: "idle",      // "up" | "down" | "idle"
    doorState: "closed",    // "open" | "closed"
    isMoving: false,
    queueUp: [],            // etages dessus
    queueDown: [],          // etages dessous
    history: [],
});



// ######## AJOUT DE REQUETE ########

const addRequest = (state, floor) => {

    // etage hors limites
    if(floor < MIN_FLOOR || floor > MAX_FLOOR) return state;

    // on est deja a cet etage
    if(floor === state.currentFloor && !state.isMoving){
        return openDoors(state);
    }

    // etage au dessus 
    if(floor > state.currentFloor){
        if(state.queueUp.includes(floor)) return state;
        const newQueueUp = [...state.queueUp, floor].sort((a, b) => a - b);
        return { ...state, queueUp: newQueueUp };
    }

    // etage en dessous 
    if(floor < state.currentFloor){
        if(state.queueDown.includes(floor)) return state;
        const newQueueDown = [...state.queueDown, floor].sort((a, b) => b - a);
        return { ...state, queueDown: newQueueDown };
    }

    return state;
};



// ######## DIRECTION SUIVANTE ########

const nextDirection = (state) => {

    // si on monte et qu'il reste des etages au dessus, continuer
    if(state.direction === "up" && state.queueUp.length > 0) return "up";

    // si on descend et qu'il reste des etages en dessous, continuer
    if(state.direction === "down" && state.queueDown.length > 0) return "down";

    // sinon basculer si l'autre queue a des demandes
    if(state.direction === "up" && state.queueDown.length > 0) return "down";
    if(state.direction === "down" && state.queueUp.length > 0) return "up";

    // idle 
    if(state.queueUp.length > 0) return "up";
    if(state.queueDown.length > 0) return "down";

    return "idle";
};



// ######## PORTES ########

const openDoors = (state) => {
    return {
        ...state,
        doorState: "open",
        isMoving: false,
    };
};

const closeDoors = (state) => {
    const dir = nextDirection(state);
    return {
        ...state,
        doorState: "closed",
        direction: dir,
        isMoving: dir !== "idle",
    };
};



// ######## TICK (PAS DE TEMPS) ########

const tick = (state) => {

    // on bouge pas ou portes ouvertes → rien
    if(!state.isMoving || state.doorState !== "closed") return state;

    // deplacement d'un etage
    let newFloor = state.currentFloor;
    if(state.direction === "up") newFloor += 1;
    if(state.direction === "down") newFloor -= 1;

    // securite bornes
    newFloor = Math.max(MIN_FLOOR, Math.min(MAX_FLOOR, newFloor));

    let newState = {
        ...state,
        currentFloor: newFloor,
        history: [...state.history, newFloor],
    };

    // verifier si l'etage est dans la queue active
    if(state.direction === "up" && newState.queueUp.includes(newFloor)){
        newState = {
            ...newState,
            queueUp: newState.queueUp.filter(f => f !== newFloor),
        };
        return openDoors(newState);
    }

    if(state.direction === "down" && newState.queueDown.includes(newFloor)){
        newState = {
            ...newState,
            queueDown: newState.queueDown.filter(f => f !== newFloor),
        };
        return openDoors(newState);
    }

    return newState;
};



// ######## APPELS EXTERNES / INTERNES ########

// appel bouton externe
const callFromFloor = (state, floor) => {
    let newState = addRequest(state, floor);

    // si l'ascenseur etait idle, on le met en route
    if(newState.direction === "idle" && !newState.isMoving && newState.doorState === "closed"){
        const dir = nextDirection(newState);
        newState = {
            ...newState,
            direction: dir,
            isMoving: dir !== "idle",
        };
    }

    return newState;
};

// bouton interne
const selectDestination = (state, floor) => {
    return callFromFloor(state, floor);
};



export {
    createInitialElevatorState,
    addRequest,
    nextDirection,
    openDoors,
    closeDoors,
    tick,
    callFromFloor,
    selectDestination,
    MIN_FLOOR,
    MAX_FLOOR,
};
