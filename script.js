"use strict";

const choiceBtns = document.querySelectorAll('.choice-btn');
const playerEl = document.querySelector('.choice.player');
const cpuEl = document.querySelector('.choice.cpu');
const stateEl = document.getElementById('game-state');
const wonEl = document.getElementById('won');
const drawEl = document.getElementById('draw');
const lostEl = document.getElementById('lost');
const resetBtn = document.getElementById('reset-btn');
const themeToggle = document.getElementById('theme-toggle');
const audioToggle = document.getElementById('audio-toggle');
const bgMusic = document.getElementById('bg-music');

const emoji = { rock:'✊', paper:'🖐️', scissors:'✌️' };
let scores = { won:0, draw:0, lost:0 };
updateScoreboard();

const savedTheme = localStorage.getItem('gesture-arena-theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);
themeToggle.checked = savedTheme === 'dark';
themeToggle.addEventListener('change', () => {
  const newTheme = themeToggle.checked ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('gesture-arena-theme', newTheme);
});

let musicStarted = false;
audioToggle.addEventListener('change', () => {
  if (audioToggle.checked) {
    if (!musicStarted) {
      bgMusic.volume = 0.3;
      bgMusic.play().catch(() => {});
      musicStarted = true;
    } else {
      bgMusic.play().catch(() => {});
    }
  } else {
    bgMusic.pause();
  }
});
document.addEventListener('click', () => {
  if (!musicStarted && audioToggle.checked) {
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {});
    musicStarted = true;
  }
}, { once:true });

choiceBtns.forEach(btn => btn.addEventListener('click', () => playRound(btn.value)));
function playRound(playerChoice) {
  choiceBtns.forEach(b => b.disabled = true);
  const cpuChoice = ['rock','paper','scissors'][Math.floor(Math.random()*3)];
  stateEl.textContent = "Let's Play!";
  stateEl.classList.remove('win','draw','lose'); // Always reset color for Let's Play!
  playerEl.textContent = cpuEl.textContent = '✊';
  playerEl.classList.add('p-anim'); cpuEl.classList.add('c-anim');
  setTimeout(() => {
    playerEl.textContent = emoji[playerChoice];
    cpuEl.textContent = emoji[cpuChoice];
    playerEl.classList.remove('p-anim'); cpuEl.classList.remove('c-anim');
    updateResult(playerChoice, cpuChoice);
    choiceBtns.forEach(b => b.disabled = false);
  }, 2000);
}
function updateResult(p,c){
  stateEl.classList.remove('win','draw','lose');
  if(p===c){
    stateEl.textContent='Draw!';
    stateEl.classList.add('draw');
    scores.draw++;
  }
  else if((p==='rock'&&c==='scissors')||(p==='paper'&&c==='rock')||(p==='scissors'&&c==='paper')){
    stateEl.textContent='You Win!';
    stateEl.classList.add('win');
    scores.won++;
  } else{
    stateEl.textContent='You Lose!';
    stateEl.classList.add('lose');
    scores.lost++;
  }
  // Always keep default color for "Let's Play!"
  if(stateEl.textContent==="Let's Play!"){
    stateEl.classList.remove('win','draw','lose');
  }
  updateScoreboard();
}
function updateScoreboard(){
  wonEl.textContent = scores.won;
  drawEl.textContent = scores.draw;
  lostEl.textContent = scores.lost;
}
resetBtn.addEventListener('click', () => {
  scores = { won: 0, draw: 0, lost: 0 };
  updateScoreboard();
  stateEl.textContent = "Let's Play!";
  stateEl.classList.remove('win', 'draw', 'lose'); // Always reset color for Let's Play!
  playerEl.textContent = cpuEl.textContent = '✊';
});
