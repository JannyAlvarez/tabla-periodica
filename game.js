let score = 0;
let currentElementIndex = 0;
let quizQuestions = [];
let currentQuizIndex = 0;
let quizAnswered = false;

// Datos educativos para cada elemento
const elementFacts = {
  1: 'El hidrógeno es el elemento más abundante del universo. Forma el agua y todos los compuestos orgánicos.',
  2: 'El helio es usado en globos y en criogenia. Es el único elemento que no se congela a temperatura absoluta.',
  3: 'El litio es muy ligero y se usa en baterías modernas. Es un metal que reacciona violentamente con el agua.',
  6: 'El carbono es la base de toda la vida. Puede formar más compuestos que todos los demás elementos juntos.',
  7: 'El nitrógeno forma el 78% de la atmósfera. Es esencial para las proteínas y el ADN.',
  8: 'El oxígeno es esencial para la respiración. Reacciona con la mayoría de los elementos.',
  26: 'El hierro es el metal más usado industrialmente. Tu sangre lo necesita para transportar oxígeno.',
  79: 'El oro es muy raro y valioso. Es tan maleable que puede convertirse en hojas de solo átomos de grosor.',
  92: 'El uranio es radiactivo. Se usa en energía nuclear y en armas nucleares.',
};

function initGame() {
  setupTabs();
  loadAprendeTab();
  loadQuizTab();
  loadClasificaTab();
}

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      tabBtns.forEach((b) => b.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabName).classList.add('active');
    });
  });
}

// ====== APRENDE TAB ======
function loadAprendeTab() {
  const card = document.getElementById('elementCard');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });

  prevBtn.addEventListener('click', () => {
    currentElementIndex = (currentElementIndex - 1 + fullElements.length) % fullElements.length;
    updateElementDisplay();
  });

  nextBtn.addEventListener('click', () => {
    currentElementIndex = (currentElementIndex + 1) % fullElements.length;
    updateElementDisplay();
  });

  updateElementDisplay();
}

function updateElementDisplay() {
  const element = fullElements[currentElementIndex];
  const card = document.getElementById('elementCard');

  card.classList.remove('flipped');

  document.getElementById('cardSymbol').textContent = element.symbol;
  document.getElementById('cardName').textContent = element.name;
  document.getElementById('cardInfo').textContent =
    elementFacts[element.number] ||
    `${element.name} - Número atómico: ${element.number}, Masa: ${element.mass}`;

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

  document.getElementById('infoName').textContent = element.name;
  document.getElementById('infoData').innerHTML = `
    <strong>Símbolo:</strong> ${element.symbol}<br>
    <strong>Número Atómico:</strong> ${element.number}<br>
    <strong>Masa Atómica:</strong> ${element.mass}<br>
    <strong>Categoría:</strong> ${categoryNames[element.category]}<br>
    <br>
    <em>${elementFacts[element.number] || 'Elemento fascinante de la tabla periódica.'}</em>
  `;
}

// ====== QUIZ TAB ======
function loadQuizTab() {
  generateQuizQuestions();
  displayQuizQuestion();
}

function generateQuizQuestions() {
  quizQuestions = [];
  const shuffled = fullElements.sort(() => Math.random() - 0.5).slice(0, 10);

  shuffled.forEach((element) => {
    const others = fullElements.filter((e) => e.number !== element.number).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [element, ...others].sort(() => Math.random() - 0.5);

    quizQuestions.push({
      question: `¿Cuál es el símbolo de ${element.name}?`,
      correct: element,
      options: options,
    });
  });

  currentQuizIndex = 0;
}

function displayQuizQuestion() {
  if (currentQuizIndex >= quizQuestions.length) {
    document.querySelector('.question h2').textContent = '¡Quiz completado!';
    document.getElementById('answerOptions').innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; color: #00ff00; font-size: 1.2rem;">
        Obtuviste <strong>${score}</strong> puntos
      </div>
    `;
    document.getElementById('skipBtn').textContent = 'Jugar de nuevo';
    document.getElementById('skipBtn').onclick = () => {
      score = 0;
      document.getElementById('score').textContent = '0';
      generateQuizQuestions();
      displayQuizQuestion();
    };
    return;
  }

  const q = quizQuestions[currentQuizIndex];
  document.querySelector('.question h2').textContent = q.question;
  document.getElementById('progressFill').style.width = ((currentQuizIndex + 1) / quizQuestions.length) * 100 + '%';
  document.getElementById('progressText').textContent = `${currentQuizIndex + 1} / ${quizQuestions.length}`;

  const optionsContainer = document.getElementById('answerOptions');
  optionsContainer.innerHTML = '';

  q.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.className = 'answer-option';
    btn.textContent = `${option.symbol} - ${option.name}`;
    btn.onclick = () => checkAnswer(option, q.correct, btn);
    optionsContainer.appendChild(btn);
  });

  quizAnswered = false;
}

function checkAnswer(selected, correct, btnElement) {
  if (quizAnswered) return;
  quizAnswered = true;

  const allBtns = document.querySelectorAll('.answer-option');
  allBtns.forEach((btn) => (btn.style.pointerEvents = 'none'));

  allBtns.forEach((btn) => {
    if (btn.textContent.includes(correct.symbol)) {
      btn.classList.add('correct');
    }
  });

  if (selected.number === correct.number) {
    btnElement.classList.add('correct');
    score += 10;
    document.getElementById('score').textContent = score;
  } else {
    btnElement.classList.add('wrong');
  }

  setTimeout(() => {
    currentQuizIndex++;
    displayQuizQuestion();
  }, 1500);
}

// ====== CLASIFICA TAB ======
function loadClasificaTab() {
  const elementsToClassify = document.getElementById('elementsToClassify');
  const categories = ['metal', 'nonmetal', 'noble', 'metalloid'];
  const sampled = fullElements.filter((e) => categories.includes(e.category)).sort(() => Math.random() - 0.5).slice(0, 12);

  elementsToClassify.innerHTML = '';
  sampled.forEach((element) => {
    const div = document.createElement('div');
    div.className = 'draggable-element';
    div.textContent = element.symbol;
    div.draggable = true;
    div.dataset.category = element.category;
    div.dataset.number = element.number;

    div.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.target.classList.add('dragging');
    });

    div.addEventListener('dragend', (e) => {
      e.target.classList.remove('dragging');
    });

    elementsToClassify.appendChild(div);
  });

  setupDropZones();
}

function setupDropZones() {
  const dropZones = document.querySelectorAll('.drop-zone');

  dropZones.forEach((zone) => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');

      const draggable = document.querySelector('.dragging');
      const category = draggable.dataset.category;
      const parentCategory = getZoneCategory(zone);

      if (category === parentCategory) {
        const card = document.createElement('div');
        card.className = 'element-card-classify';
        card.textContent = draggable.textContent;
        zone.appendChild(card);
        draggable.remove();
        score += 5;
        document.getElementById('score').textContent = score;

        if (document.getElementById('elementsToClassify').children.length === 0) {
          alert('¡Completado! ¡Ganaste ' + (12 * 5) + ' puntos!');
          loadClasificaTab();
          score += 40;
          document.getElementById('score').textContent = score;
        }
      } else {
        alert('¡Categoría incorrecta! Intenta de nuevo.');
      }
    });
  });
}

function getZoneCategory(zone) {
  const parent = zone.closest('.category-drop');
  if (parent.id === 'drop1') return 'metal';
  if (parent.id === 'drop2') return 'nonmetal';
  if (parent.id === 'drop3') return 'noble';
  if (parent.id === 'drop4') return 'metalloid';
  return null;
}

// Iniciar el juego
initGame();
