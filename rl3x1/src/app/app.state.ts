import { command, advanceFilter } from './app.types';

export interface AppState {
  readonly command: command[];
  readonly advanceFilter: advanceFilter[];
}