import { useState, useEffect, useRef } from 'react'
import {
    createInitialElevatorState,
    callFromFloor as callFromFloorLogic,
    selectDestination as selectDestinationLogic,
    closeDoors,
    tick,
} from '../domain/elevatorLogic'



const TICK_INTERVAL = 800; 
const DOOR_DELAY = 1500; 



const useElevator = () => {

    const [state, setState] = useState(createInitialElevatorState());
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef(null);
    const doorTimeoutRef = useRef(null);



    // ######## TICK AUTOMATIQUE ########

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setState(prev => {

                // pause ou portes ouvertes, on ne fait rien
                if(isPaused || prev.doorState === "open") return prev;

                const next = tick(prev);

                // si les portes viennent de s'ouvrir, programmer la fermeture auto
                if(next.doorState === "open" && prev.doorState !== "open"){
                    doorTimeoutRef.current = setTimeout(() => {
                        setState(s => closeDoors(s));
                    }, DOOR_DELAY);
                }

                return next;
            });
        }, TICK_INTERVAL);

        return () => {
            clearInterval(intervalRef.current);
            clearTimeout(doorTimeoutRef.current);
        };
    }, [isPaused]);



    // ######## APPEL EXTERNE ########

    const callFromFloor = (floor) => {
        setState(prev => {
            let next = callFromFloorLogic(prev, floor);

            // si l'ascenseur etait idle avec portes fermees, on demarre
            if(prev.direction === "idle" && next.direction !== "idle" && next.doorState === "closed"){
                next = { ...next, isMoving: true };
            }

            // si on est deja a l'etage, portes ouvertes, programmer fermeture
            if(next.doorState === "open" && prev.doorState !== "open"){
                clearTimeout(doorTimeoutRef.current);
                doorTimeoutRef.current = setTimeout(() => {
                    setState(s => closeDoors(s));
                }, DOOR_DELAY);
            }

            return next;
        });
    };



    // ######## SELECTION INTERNE ########

    const selectDestination = (floor) => {
        setState(prev => {
            let next = selectDestinationLogic(prev, floor);

            if(prev.direction === "idle" && next.direction !== "idle" && next.doorState === "closed"){
                next = { ...next, isMoving: true };
            }

            if(next.doorState === "open" && prev.doorState !== "open"){
                clearTimeout(doorTimeoutRef.current);
                doorTimeoutRef.current = setTimeout(() => {
                    setState(s => closeDoors(s));
                }, DOOR_DELAY);
            }

            return next;
        });
    };



    // ######## PAUSE / RESUME ########

    const pause = () => setIsPaused(true);
    const resume = () => setIsPaused(false);



    return {
        state,
        isPaused,
        callFromFloor,
        selectDestination,
        pause,
        resume,
    };
};

export default useElevator
