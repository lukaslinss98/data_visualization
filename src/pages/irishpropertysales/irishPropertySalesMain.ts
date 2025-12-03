import {type Metric, setMetric, setYear} from "./sharedState.ts";

const yearSlider = document.getElementById("year-slider") as HTMLInputElement
yearSlider.addEventListener("input", () => {
    console.log(yearSlider.value)
    setYear(Number(yearSlider.value));
});

const metricControls = document.getElementById("metric-controls")!;
metricControls.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.name === "metric") {
        setMetric(target.value as Metric);
    }
});
