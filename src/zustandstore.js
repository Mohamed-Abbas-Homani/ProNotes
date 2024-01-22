import { create } from 'zustand'

const useStore = create((set) => ({
  notes: [],
  current: null,
  colors: {},
  setNotes: (newNotes) => set(() => ({notes: newNotes})),
  setCurrent: (newCurrent) => set(() => ({current: newCurrent})),
  setColors: (newColors) => set(() => ({colors: newColors})),
}))

export const useNotes = () => useStore(state => state.notes);
export const useCurrent = () => useStore(state => state.current);
export const useColors = () => useStore(state => state.colors);
export const useSetNotes = () => useStore(state => state.setNotes);
export const useSetCurrent = () => useStore(state => state.setCurrent);
export const useSetColors = () => useStore(state => state.setColors);

export default useStore;