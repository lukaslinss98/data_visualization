import {getYear, setYear} from "./sharedState.ts";

const yearSlider = document.getElementById("year-slider") as HTMLInputElement
const playPauseBtn = document.getElementById("play-pause-btn") as HTMLButtonElement
const playIcon = document.getElementById("play-icon")
const pauseIcon = document.getElementById("pause-icon")
const yearDisplay = document.getElementById("year-display") as HTMLParagraphElement

yearSlider.addEventListener("input", () => {
  console.log(yearSlider.value)
  setYear(Number(yearSlider.value));
});

let isPlaying = false;
let animationInterval: number | null = null;

yearSlider.addEventListener("input", () => {
  stop();
  const year = Number(yearSlider.value);
  setYear(year);
  yearDisplay.textContent = `Year: ${year}`;
});

playPauseBtn.addEventListener("click", () => {
  if (isPlaying) {
    stop();
  } else {
    play();
  }
});

function play() {
  isPlaying = true;
  playIcon.classList.add("hidden");
  pauseIcon.classList.remove("hidden");

  animationInterval = window.setInterval(() => {
    let currentYear = getYear();
    currentYear = currentYear >= 2025 ? 2010 : currentYear + 1

    setYear(currentYear);
    yearSlider.value = String(currentYear);
    yearDisplay.textContent = `Year: ${currentYear}`;

  }, 2000);
}

function stop() {
  isPlaying = false;
  playIcon.classList.remove("hidden");
  pauseIcon.classList.add("hidden");

  if (animationInterval !== null) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}