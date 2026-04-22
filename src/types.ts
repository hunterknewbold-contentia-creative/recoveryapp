/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Mood = 'great' | 'good' | 'okay' | 'tough' | 'very-hard';

export interface CheckIn {
  id: string;
  timestamp: number;
  cravingLevel: number; // 0-10
  mood: Mood;
  sleepHours: number;
  triggerNote: string;
  nextAction: string;
  didUse: boolean;
  tookMeds: boolean;
  notes: string;
}

export interface UserState {
  streak: number;
  lastCheckInDate: string | null; // ISO string for the date part (YYYY-MM-DD)
  checkIns: CheckIn[];
  medHistory: { date: string, taken: boolean }[];
}
