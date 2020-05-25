import { appSession } from '../app.types';
import { Action } from '@ngrx/store';

export const ADD_SESSION = 'ADD_SESSION';

export function sessionReducer(state: appSession[] = [], action) {
  switch (action.type) {
    case ADD_SESSION:
        return [...state, action.payload];
    default:
        return state;
    }
}