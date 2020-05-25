import { command } from '../app.types';
import { Action } from '@ngrx/store';

export const ADD_COMMAND = 'ADD_COMMAND';

export function commandReducer(state: command[] = [], action) {
  switch (action.type) {
    case ADD_COMMAND:
        return [...state, action.payload];
    default:
        return state;
    }
}