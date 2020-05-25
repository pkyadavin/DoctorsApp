import { advanceFilter } from '../app.types';
import { Action } from '@ngrx/store';

export const ADD_FILTER = 'ADD_FILTER';

export function filterReducer(state: advanceFilter[] = [], action) {
  switch (action.type) {
    case ADD_FILTER:
        return [...state, action.payload];
    default:
        return state;
    }
}