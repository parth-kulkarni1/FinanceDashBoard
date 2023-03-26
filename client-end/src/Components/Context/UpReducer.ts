import { CurrentState, CurrentAction } from "./UpContext";

export function UpReducer(state: CurrentState, action: CurrentAction): CurrentState{
    switch(action.type){
        
        default:
            return state;
    }
}