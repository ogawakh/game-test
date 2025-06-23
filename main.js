// --- ゲーム設定 ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const PLAYER_SPEED = 5;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const BULLET_SPEED = 7;
const ENEMY_WIDTH = 36;
const ENEMY_HEIGHT = 20;
const ENEMY_SPEED = 2;
const ENEMY_INTERVAL = 60; // フレーム間隔

let player = {
  x: canvas.width / 2 - PLAYER_WIDTH / 2,
  y: canvas.height - PLAYER_HEIGHT - 10,
  width: PLAYER_WIDTH,
  height: PLAYER_HEIGHT
};

let bullets = [];
let enemies = [];
let keys = {};
let frameCount = 0;
let score = 0;
let gameOver = false;

// --- イベントリスナー ---
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " " && !gameOver) shoot();
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// --- 弾発射 ---
function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - BULLET_WIDTH / 2,
    y: player.y,
    width: BULLET_WIDTH,
    height: BULLET_HEIGHT
  });
}

// --- 敵生成 ---
function spawnEnemy() {
  const x = Math.random() * (canvas.width - ENEMY_WIDTH);
  enemies.push({
    x: x,
    y: -ENEMY_HEIGHT,
    width: ENEMY_WIDTH,
    height: ENEMY_HEIGHT
  });
}

// --- 衝突判定 ---
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// --- ゲームループ ---
function update() {
  if (gameOver) return;

  // プレイヤー移動
  if (keys["ArrowLeft"] && player.x > 0) player.x -= PLAYER_SPEED;
  if (keys["ArrowRight"] && player.x < canvas.width - player.width) player.x += PLAYER_SPEED;

  // 弾移動
  bullets.forEach((b) => (b.y -= BULLET_SPEED));
  bullets = bullets.filter((b) => b.y + b.height > 0);

  // 敵移動
  enemies.forEach((e) => (e.y += ENEMY_SPEED));
  enemies = enemies.filter((e) => e.y < canvas.height);

  // 弾と敵の衝突
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (isColliding(enemies[i], bullets[j])) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        break;
      }
    }
  }

  // 敵とプレイヤーの衝突
  for (let e of enemies) {
    if (isColliding(e, player)) {
      gameOver = true;
    }
  }

  // 敵生成
  if (frameCount % ENEMY_INTERVAL === 0) spawnEnemy();

  frameCount++;
}

// --- 描画 ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // プレイヤー
  ctx.fillStyle = "#0ff";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 弾
  ctx.fillStyle = "#ff0";
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));

  // 敵
  ctx.fillStyle = "#f44";
  enemies.forEach((e) => ctx.fillRect(e.x, e.y, e.width, e.height));

  // スコア
  ctx.fillStyle = "#fff";
  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 30);

  // ゲームオーバー
  if (gameOver) {
    ctx.font = "40px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);
  }
}

// --- メインループ ---
function loop() {
  update();
  draw();
  if (!gameOver) requestAnimationFrame(loop);
}
loop();
