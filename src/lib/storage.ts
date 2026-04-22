/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserState, CheckIn } from '../types';

const STORAGE_KEY = 'steady_recovery_data';

const DEFAULT_STATE: UserState = {
  streak: 0,
  lastCheckInDate: null,
  checkIns: [],
  medHistory: [],
};

export function getState(): UserState {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_STATE;
  try {
    return JSON.parse(saved);
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: UserState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function addCheckIn(checkIn: CheckIn) {
  const state = getState();
  const newState = {
    ...state,
    checkIns: [checkIn, ...state.checkIns],
    lastCheckInDate: new Date(checkIn.timestamp).toISOString().split('T')[0],
  };

  // Logic for streak calculation
  // (Simple implementation: increment if consecutive day and didn't use)
  if (!checkIn.didUse) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (state.lastCheckInDate === yesterday) {
      newState.streak = state.streak + 1;
    } else if (!state.lastCheckInDate || state.lastCheckInDate < yesterday) {
      // Re-starting or first time
      newState.streak = 1;
    }
  } else {
    newState.streak = 0;
  }

  saveState(newState);
  return newState;
}
