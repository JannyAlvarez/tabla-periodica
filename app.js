const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const viewButtons = document.querySelectorAll('.btn-view');
const elementInfo = document.getElementById('elementInfo');

let currentView = 'table';
let hoveredElement = null;
let animationAngle = 0;

// Control de manipulación
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let offsetX = 0;
let offsetY = 0;
let zoom = 1;
let rotation = 0;

const COLORS = {
  nonmetal: '#00ff88',
  metal: '#00ff55',
  metalloid: '#00ff00',
  noble: '#00ffff',
  alkali: '#0fff00',
  alkaline: '#0fff00',
  transition: '#00ffaa',
  lanthanide: '#ff00ff',
  actinide: '#ff6600',
};

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

viewButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    viewButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentView = btn.dataset.view;
    hoveredElement = null;
    animationAngle = 0;
    offsetX = 0;
    offsetY = 0;
    zoom = 1;
    rotation = 0;
  });
});

// Eventos de mouse para arrastrar
canvas.addEventListener('mousedown', (e) => {
  if (currentView === 'table') {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging && currentView === 'table') {
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    offsetX += deltaX;
    offsetY += deltaY;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
  }

  if (currentView === 'table') {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offsetX) / zoom;
    const y = (e.clientY - rect.top - offsetY) / zoom;
    hoveredElement = getElementAtPosition(x, y);
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  hoveredElement = null;
});

// Zoom con rueda del ratón
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (currentView === 'table') {
    const zoomSpeed = 0.1;
    zoom += e.deltaY > 0 ? -zoomSpeed : zoomSpeed;
    zoom = Math.max(0.5, Math.min(3, zoom));
  }
});

function getElementAtPosition(x, y) {
  const cellWidth = 50;
  const cellHeight = 50;
  const startX = 40;
  const startY = 40;

  for (const element of fullElements) {
    if (element.row > 7) continue;
    
    let gridX = element.col - 1;
    let gridY = element.row - 1;
    
    const elemX = startX + gridX * cellWidth;
    const elemY = startY + gridY * cellHeight;

    if (x >= elemX && x < elemX + cellWidth && y >= elemY && y < elemY + cellHeight) {
      return element;
    }
  }

  // Check lanthanides
  fullElements.forEach((element) => {
    if (element.row === 8) {
      const gridX = element.col - 3;
      const gridY = 8;
      
      const elemX = startX + gridX * cellWidth;
      const elemY = startY + gridY * cellHeight;

      if (x >= elemX && x < elemX + cellWidth && y >= elemY && y < elemY + cellHeight) {
        hoveredElement = element;
      }
    }
  });

  // Check actinides
  fullElements.forEach((element) => {
    if (element.row === 9) {
      const gridX = element.col - 3;
      const gridY = 9;
      
      const elemX = startX + gridX * cellWidth;
      const elemY = startY + gridY * cellHeight;

      if (x >= elemX && x < elemX + cellWidth && y >= elemY && y < elemY + cellHeight) {
        hoveredElement = element;
      }
    }
  });

  return null;
}

function drawElement(x, y, width, height, element, isHovered = false) {
  const color = COLORS[element.category] || '#00ff88';

  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = isHovered ? 1 : 0.7;
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = isHovered ? 2.5 : 1.5;
  ctx.strokeRect(x, y, width, height);

  if (isHovered) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
  }

  ctx.fillStyle = '#000000';
  ctx.font = `bold 12px 'Courier New'`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(element.symbol, x + width / 2, y + height / 2 - 8);

  ctx.fillStyle = color;
  ctx.font = `9px 'Courier New'`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(element.number, x + 3, y + 3);

  ctx.restore();
}

function drawPeriodicTable() {
  const cellWidth = 50;
  const cellHeight = 50;
  const startX = 40;
  const startY = 40;

  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(zoom, zoom);

  // Draw main periodic table
  fullElements.forEach((element) => {
    if (element.row > 7) return;

    let gridX = element.col - 1;
    let gridY = element.row - 1;

    const x = startX + gridX * cellWidth;
    const y = startY + gridY * cellHeight;

    const isHovered = hoveredElement && hoveredElement.number === element.number;
    drawElement(x, y, cellWidth, cellHeight, element, isHovered);
  });

  // Draw lanthanides
  fullElements.forEach((element) => {
    if (element.row !== 8) return;

    const gridX = element.col - 3;
    const gridY = 8;

    const x = startX + gridX * cellWidth;
    const y = startY + gridY * cellHeight;

    const isHovered = hoveredElement && hoveredElement.number === element.number;
    drawElement(x, y, cellWidth, cellHeight, element, isHovered);
  });

  // Draw actinides
  fullElements.forEach((element) => {
    if (element.row !== 9) return;

    const gridX = element.col - 3;
    const gridY = 9;

    const x = startX + gridX * cellWidth;
    const y = startY + gridY * cellHeight;

    const isHovered = hoveredElement && hoveredElement.number === element.number;
    drawElement(x, y, cellWidth, cellHeight, element, isHovered);
  });

  ctx.restore();
}

function drawAlternativeViews() {
  if (currentView === 'sphere') {
    drawSphereView();
  } else if (currentView === 'helix') {
    drawHelixView();
  } else if (currentView === 'grid') {
    drawGridView();
  }
}

function drawSphereView() {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) / 3;

  fullElements.forEach((element) => {
    const angle = (element.number / fullElements.length) * Math.PI * 2 + animationAngle;
    const depth = Math.sin((element.number / fullElements.length) * Math.PI);
    const x = centerX + Math.cos(angle) * radius * depth;
    const y = centerY + Math.sin(angle) * radius * 0.7;

    const isHovered = hoveredElement && hoveredElement.number === element.number;
    drawElement(x - 15, y - 15, 30, 30, element, isHovered);
  });
}

function drawHelixView() {
  const centerX = canvas.width / 2;
  const startY = canvas.height * 0.15;
  const radius = canvas.width * 0.25;
  const spacing = canvas.height / fullElements.length * 0.9;

  fullElements.forEach((element) => {
    const angle = (element.number / 10) * Math.PI * 2 + animationAngle;
    const y = startY + element.number * spacing;
    const x = centerX + Math.cos(angle) * radius;

    const isHovered = hoveredElement && hoveredElement.number === element.number;
    drawElement(x - 15, y - 15, 30, 30, element, isHovered);
  });
}

function drawGridView() {
  const startX = canvas.width * 0.05;
  const startY = canvas.height * 0.05;
  const cellSize = 35;
  const cols = Math.floor((canvas.width * 0.9) / cellSize);

  fullElements.forEach((element) => {
    const row = Math.floor((element.number - 1) / cols);
    const col = (element.number - 1) % cols;
    const x = startX + col * cellSize;
    const y = startY + row * cellSize;

    const isHovered = hoveredElement && hoveredElement.number === element.number;
    drawElement(x, y, cellSize, cellSize, element, isHovered);
  });
}

function drawScene() {
  ctx.fillStyle = 'rgba(0, 0, 17, 0.3)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (currentView === 'table') {
    drawPeriodicTable();
  } else {
    drawAlternativeViews();
  }

  if (hoveredElement) {
    updateInfoPanel(hoveredElement);
  } else {
    elementInfo.innerHTML = `
      <h3>Tabla Periódica Interactiva</h3>
      <p>Arrastra para mover | Rueda para zoom | Pasa el cursor sobre los elementos</p>
    `;
  }

  animationAngle += 0.01;
  requestAnimationFrame(drawScene);
}

function updateInfoPanel(element) {
  const categoryNames = {
    nonmetal: 'No Metal',
    metal: 'Metal',
    metalloid: 'Metaloide',
    noble: 'Gas Noble',
    alkali: 'Metal Alcalino',
    alkaline: 'Metal Alcalinotérreo',
    transition: 'Metal de Transición',
    lanthanide: 'Lantánido',
    actinide: 'Actínido',
  };

  elementInfo.innerHTML = `
    <h3>${element.name}</h3>
    <p>
      <strong>Símbolo:</strong> ${element.symbol}<br>
      <strong>Número atómico:</strong> ${element.number}<br>
      <strong>Masa atómica:</strong> ${element.mass}<br>
      <strong>Categoría:</strong> ${categoryNames[element.category]}<br>
      <strong>Periodo:</strong> ${element.row <= 7 ? element.row : (element.row === 8 ? 6 : 7)} | <strong>Grupo:</strong> ${element.col}
    </p>
  `;
}

drawScene();
