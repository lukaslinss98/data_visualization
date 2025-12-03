export type Metric = "Average Price" | "Total Volume" | "Number of Sales";

type Listener = (state: State) => void;
type State = {
    year: number,
    metric: Metric
}
const state: State = {
    year: 2010,
    metric: 'Average Price'
}
const listeners = new Set<Listener>();

export function getYear() {
    return state.year;
}

export function getMetric() {
    return state.metric;
}

export function setYear(year: number) {
    if (year === state.year) return;
    state.year = year;
    document.getElementById("year-display").innerText = `Year: ${state.year}`
    listeners.forEach(listener => listener(state))
}

export function setMetric(metric: Metric) {
    if (metric === state.metric) return;
    state.metric = metric;
    listeners.forEach(listener => listener(state))
}

export function subscribeToState(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
