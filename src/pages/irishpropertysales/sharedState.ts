export type Metric = "Average Price" | "Total Volume" | "Number of Sales";

type Listener = (state: State) => void;
type State = {
  year: number,
}
const state: State = {
  year: 2010,
}
const listeners = new Set<Listener>();

export function getYear() {
  return state.year;
}

export function setYear(year: number) {
  if (year === state.year) return;
  state.year = year;
  document.getElementById("year-display").innerText = `Year: ${state.year}`
  listeners.forEach(listener => listener(state))
}

export function subscribeToState(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
