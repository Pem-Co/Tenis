const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
const grid = 15;
const raquetaHeight = grid * 5; // 80
const maxraquetaY = canvas.height - grid - raquetaHeight;

var raquetaSpeed = 20;
var pelotaSpeed = 7;

var p1Text;
var p1 = 0;

const izquierdaraqueta = {
  // Comienza a la izquierda
  x: grid * 2,
  y: canvas.height / 2 - raquetaHeight / 2,
  width: grid,
  height: raquetaHeight,

  // Velocidad de las raquetas
  dy: 0
};
const derecharaqueta = {
  // Comienza a la derecha
  x: canvas.width - grid * 3,
  y: canvas.height / 2 - raquetaHeight / 2,
  width: grid,
  height: raquetaHeight,

  // Velocidad de las raquetas
  dy: 0
};
const pelota = {
  // Comienza en la mitad
  x: canvas.width / 2,
  y: canvas.height / 2,
  width: grid,
  height: grid,

  // Que vuelva al centro
  resetting: false,

  // Velocidad al tocar a arriba
  dx: pelotaSpeed,
  dy: -pelotaSpeed
};

/* Colisión de dos objetos sacado de:
@see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection*/
function collides(obj1, obj2) {
  return obj1.x < obj2.x + obj2.width &&
         obj1.x + obj1.width > obj2.x &&
         obj1.y < obj2.y + obj2.height &&
         obj1.y + obj1.height > obj2.y;
}

// Loop
function loop() {
  requestAnimationFrame(loop);
  context.clearRect(0,0,canvas.width,canvas.height);
  // Velocidad de Raquetas
  izquierdaraqueta.y += izquierdaraqueta.dy;
  derecharaqueta.y += derecharaqueta.dy;

  // Pared - Raquetas
  if (izquierdaraqueta.y < pelota.y) {
    izquierdaraqueta.y = pelota.y;
  }
  else if (izquierdaraqueta.y > pelota.y) {
    izquierdaraqueta.y = pelota.y;
  }

  if (derecharaqueta.y < grid) {
    derecharaqueta.y = grid;
  }
  else if (derecharaqueta.y > maxraquetaY) {
    derecharaqueta.y = maxraquetaY;
  }

  // Raquetas
  context.fillStyle = 'blue';
  context.fillRect(izquierdaraqueta.x, izquierdaraqueta.y, izquierdaraqueta.width, izquierdaraqueta.height);
  context.fillStyle = 'red';
  context.fillRect(derecharaqueta.x, derecharaqueta.y, derecharaqueta.width, derecharaqueta.height);

  // Velocidad Pelota
  pelota.x += pelota.dx;
  pelota.y += pelota.dy;

  // Paredes - Pelota
  if (pelota.y < grid) {
    pelota.y = grid;
    pelota.dy *= -1;
  }
  else if (pelota.y + grid > canvas.height - grid) {
    pelota.y = canvas.height - grid * 2;
    pelota.dy *= -1;
  }

  // Resetear la pelota al anotar
  if ( (pelota.x < 0 || pelota.x > canvas.width) && !pelota.resetting) {
    pelota.resetting = true;

    // Dar tiempo
    setTimeout(() => {
      pelota.resetting = false;
      pelota.x = canvas.width / 2;
      pelota.y = canvas.height / 2;
    }, 400);
  }

  // Cambiar velocidad X
  if (collides(pelota, izquierdaraqueta)) {
    pelota.dx *= -1;

    // Choque Pared
    pelota.x = izquierdaraqueta.x + izquierdaraqueta.width;
  }
  else if (collides(pelota, derecharaqueta)) {
    pelota.dx *= -1;
    pelota.x = derecharaqueta.x - pelota.width;
  }

  // dibujar pelota
  context.fillStyle = 'purple';
  context.fillRect(pelota.x, pelota.y, pelota.width, pelota.height);

  // dibujar paredes
  context.fillStyle = 'white';
  context.fillRect(0, 0, canvas.width, grid);
  context.fillRect(0, canvas.height - grid, canvas.width, canvas.height);

  // lineas del centro
  for (let i = grid; i < canvas.height - grid; i += grid * 2) {
  	context.fillStyle = 'grey';
    context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
  }
}

// Flecha abajo
document.addEventListener('keydown', function(e) {

  // ARRIBA
  if (e.which === 38) {
    derecharaqueta.dy = -raquetaSpeed;
  }
  // ABAJO
  else if (e.which === 40) {
    derecharaqueta.dy = raquetaSpeed;
  }

  // W
  if (e.which === 87) {
    izquierdaraqueta.dy = -pelotaSpeed;
  }
  // A
  else if (e.which === 83) {
    izquierdaraqueta.dy = pelotaSpeed;
  }
});

// Flecha Arriba
document.addEventListener('keyup', function(e) {
  if (e.which === 38 || e.which === 40) {
    derecharaqueta.dy = 0;
  }

  if (e.which === 83 || e.which === 87) {
    izquierdaraqueta.dy = 0;
  }
});

// Empieza el juego
requestAnimationFrame(loop);