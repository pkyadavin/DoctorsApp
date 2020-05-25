import { recent } from '../app.types';
import { Action } from '@ngrx/store';
 
export const ADD_RECENT = 'ADD_RECENT';

export function recentReducer(state: recent[] = [], action) {
  switch (action.type) {
    case ADD_RECENT:
        return [...state, action.payload];
    default:
        return state;
    }
}