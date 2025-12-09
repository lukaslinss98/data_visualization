
type Listener = (state: State) => void;
type State = {
  year: number,
  selectedCounty: string | null
}
const state: State = {
  year: 2010,
  selectedCounty: null
}
const listeners = new Set<Listener>();

export function getYear() {
  return state.year;
}

export function getSelectedCounty() {
  return state.selectedCounty;
}

export function setYear(year: number) {
  if (year === state.year) return;
  state.year = year;
  document.getElementById("year-display").innerText = `Year: ${state.year}`
  listeners.forEach(listener => listener(state))
}
export function setCounty(county: string | null) {
  if (county === state.selectedCounty) return;
  console.log(`Updating county from ${state.selectedCounty} to ${county}`)
  state.selectedCounty = county;
  listeners.forEach(listener => listener(state))
}

export function subscribeToState(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
