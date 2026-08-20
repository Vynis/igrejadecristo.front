import { Injectable } from '@angular/core';

export interface GridState<T = any> {
  filters: any;
  data: T[];
}

@Injectable({
  providedIn: 'root'
})
export class GridStateService {
  private states: { [key: string]: GridState } = {};

  set<T>(key: string, state: GridState<T>) {
    this.states[key] = state;
  }

  get<T>(key: string): GridState<T> {
    return this.states[key] as GridState<T>;
  }

  clear(key: string) {
    delete this.states[key];
  }
}
