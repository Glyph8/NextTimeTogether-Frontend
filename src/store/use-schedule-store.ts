import { create } from 'zustand';

interface ScheduleState {
  confirmedDate: string | null;      // "2025-12-15"
  confirmedStartTime: string | null; // "14:00"
  confirmedEndTime: string | null;   // "16:00"
  
  setConfirmedSchedule: (date: string, start: string, end: string) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  confirmedDate: null,
  confirmedStartTime: null,
  confirmedEndTime: null,
  setConfirmedSchedule: (date, start, end) => 
    set({ confirmedDate: date, confirmedStartTime: start, confirmedEndTime: end }),
}));