const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const backgroundMusic = new Audio('bgm.mp4');
backgroundMusic.loop = true;

// 캔버스 크기 설정 (화면 크기에 맞게 조정)
canvas.width = window.innerWidth-30;  // 화면 너비에 맞춤
canvas.height = window.innerHeight-30;  // 화면 높이에 맞춤


// 사용자 상호작용 이벤트로 배경음악 재생
window.addEventListener('keydown', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(error => {
      console.error('Audio playback failed:', error);

    });
  }
});


let playerX = 1400, playerY = canvas.height / 2;  // 플레이어 위치 초기화 (가운데)
let isGameOver = false;

// 적 배열
const enemies = [];
let enemySize = 50; // 적 크기 초기값
let enemySpeed = 2; // 적 속도 초기값
let enemyFrequency = 1000; // 적 생성 주기 (초 단위)
let score = 0; // 게임 점수 초기화

// 적 초기화 함수 (N개의 적 생성)
function initializeEnemy() {
  // 왼쪽에서 생성, Y는 무작위 위치
  enemies.push({
    x: 0,  // 적은 항상 왼쪽에서 시작
    y: Math.random() * (canvas.height - enemySize), // 무작위 Y 위치
    width: enemySize,
    height: enemySize,
    speedX: enemySpeed,  // X 방향 속도
  });
}

// 적 이미지
const enemyImage = new Image();
enemyImage.src = 'Alin2.png';  // 적 이미지 파일을 넣어야 합니다.

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);  // 이미지로 적 그리기
  });
}

// 적 움직임
function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    enemy.x += enemy.speedX; // X 방향으로만 이동

    // 적이 캔버스를 벗어나면 배열에서 제거
    if (enemy.x > canvas.width) {
      enemies.splice(i, 1); // 배열에서 해당 적 제거
      i--;  // 배열에서 적을 제거했으므로 인덱스를 하나 줄여야 함
    }
  }
}

let startTime, currentTime;

// 점수 표시
function drawScore() {
  ctx.font = '20px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText(`Score: ${score}`, 10, 40);  // 점수 표시
}

// 충돌 감지
function checkCollisions() {
  const player = { x: playerX, y: playerY, width: 70, height: 100 };

  enemies.forEach((enemy) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      console.log('Collision detected!');
      isGameOver = true; // 게임 종료
    }
  });
}

// 플레이어 이미지
const playerImage = new Image();
playerImage.src = 'buz2.PNG';

// 플레이어 그리기
function drawPlayer() {
  ctx.drawImage(playerImage, playerX, playerY, 70, 100);
}

// 게임 루프
function gameLoop() {
  if (isGameOver) {
    alert(`Game Over! Your score is ${score}`);
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);  // 화면 초기화
  drawPlayer();  // 플레이어 그리기
  drawEnemies();  // 적 그리기
  moveEnemies();  // 적 이동
  checkCollisions();  // 충돌 감지
  drawScore();  // 점수 표시
  requestAnimationFrame(gameLoop);  // 다음 프레임 호출
}

// 키보드 입력 처리
window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp' && playerY >= 20) playerY -= 20; // 위로 이동
  if (event.key === 'ArrowDown' && playerY < canvas.height - 100) playerY += 20; // 아래로 이동
  if (event.key === 'Enter' && isGameOver) restartGame(); // 엔터 키로 게임 재시작
});

// 게임 시작
enemyImage.onload = () => {
  startTime = Date.now();  // 게임 시작 시간 초기화
  gameLoop();  // 게임 루프 시작

  // 1초마다 적을 계속 생성
  setInterval(initializeEnemy, enemyFrequency);  // 주기적으로 새로운 적 생성

  // 게임 시간이 지날수록 점수를 늘려줌
  setInterval(() => {
    // 점수 증가 (게임 루프마다 1점씩 증가)
    score++;

    // 점수가 일정 값 이상일 때 난이도 조정
    if (score > 30) enemyFrequency = 400;
    if (score > 60) enemyFrequency = 600;
    if (score > 90) enemyFrequency = 800;

    // 적 크기 키우기 (점수에 따라 커짐)
    if (score > 30) enemySize = 60;
    if (score > 60) enemySize = 70;
    if (score > 90) enemySize = 80;

    // 적 속도 증가 (점수에 따라 빨라짐)
    if (score > 30) enemySpeed = 3;
    if (score > 60) enemySpeed = 4;
    if (score > 90) enemySpeed = 5;
  }, 1000);  // 1초마다 점수와 난이도 변화 적용
};

// 게임 재시작 함수
function restartGame() {
  // 초기화
  isGameOver = false;
  playerX = 1400;
  playerY = canvas.height / 2;
  enemies.length = 0; // 기존 적 배열 비우기
  score = 0;  // 점수 초기화
  enemySize = 50;  // 적 크기 초기화
  enemySpeed = 2;  // 적 속도 초기화
  enemyFrequency = 1000;  // 적 생성 주기 초기화

  startTime = Date.now(); // 시간 초기화

  gameLoop(); // 게임 루프 재시작

  // 1초마다 적을 계속 생성
  setInterval(initializeEnemy, enemyFrequency);
}
