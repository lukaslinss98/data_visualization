import {setYear} from "./sharedState.ts";

const yearSlider = document.getElementById("year-slider") as HTMLInputElement
yearSlider.addEventListener("input", () => {
    console.log(yearSlider.value)
    setYear(Number(yearSlider.value));
});
