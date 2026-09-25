class Square {
  constructor(value, size, startX, startY, targetX, targetY) {
    this.value = value;
    this.size = size;
    this.x = startX;
    this.y = startY;
    this.startX = startX;
    this.startY = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.progress = 0;       // 0 → 1 (andamento da animação)
    this.duration = 800;     // duração em ms
  }

  static easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  get isAnimating() {
    return this.progress < 1;
  }

  update(deltaTime) {
    if (!this.isAnimating) return;

    this.progress = Math.min(this.progress + deltaTime / this.duration, 1);    
    const t = Square.easeOutCubic(this.progress);

    this.x = this.startX + (this.targetX - this.startX) * t;
    this.y = this.startY + (this.targetY - this.startY) * t;
  }

  draw(ctx) {
    ctx.fillStyle = this.isAnimating ? "#93c5fd" : "#3b82f6";
    ctx.fillRect(this.x, this.y, this.size, this.size);

    ctx.strokeStyle = "#1e3a8a";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.size, this.size);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.value, this.x + this.size / 2, this.y + this.size / 2);
  }
}

class ArrayContainer {
  constructor(x, y, capacity, cellSize, padding) {
    this.x = x;
    this.y = y;
    this.capacity = capacity;
    this.cellSize = cellSize;
    this.padding = padding;
    this.items = [];

    this.width = capacity * (cellSize + padding) + padding;
    this.height = cellSize + padding * 2;
  }

  get isFull() {
    return this.items.length >= this.capacity;
  }

  slotPosition(index) {
    return {
      x: this.x + this.padding + index * (this.cellSize + this.padding),
      y: this.y + this.padding,
    };
  }

  // Inserção comum no final do array
  add(value, startX, startY) {
    if (this.isFull) return null;

    const target = this.slotPosition(this.items.length);
    const square = new Square(value, this.cellSize, startX, startY, target.x, target.y);
    this.items.push(square);
    return square;
  }

  // Novo método: Inserção Ordenada
  insertSorted(value, startX, startY) {
    if (this.isFull) return null;

    // 1. Encontra o índice correto onde o novo valor deve entrar
    let insertIndex = this.items.findIndex((item) => item.value > value);
    if (insertIndex === -1) {
      insertIndex = this.items.length; // Insere no final se for maior que todos
    }

    // 2. Cria o novo elemento apontando para o slot de destino correto
    const target = this.slotPosition(insertIndex);
    const newSquare = new Square(value, this.cellSize, startX, startY, target.x, target.y);

    // 3. Insere o elemento na posição encontrada
    this.items.splice(insertIndex, 0, newSquare);

    // 4. Reajusta a posição (targetX, targetY) dos elementos deslocados à direita
    this.items.forEach((square, index) => {
      if (index !== insertIndex) {
        const newTarget = this.slotPosition(index);
        square.startX = square.x;
        square.startY = square.y;
        square.targetX = newTarget.x;
        square.targetY = newTarget.y;
        square.progress = 0; // Ativa a animação de deslocamento
      }
    });

    return { square: newSquare, index: insertIndex };
  }

  sort() {
    this.items.sort((a, b) => a.value - b.value);

    this.items.forEach((square, index) => {
      const target = this.slotPosition(index);
      square.startX = square.x;
      square.startY = square.y;
      square.targetX = target.x;
      square.targetY = target.y;
      square.progress = 0;
    });
  }

  isSorted() {
    for (let i = 0; i < this.items.length - 1; i++) {
      if (this.items[i].value > this.items[i + 1].value) {
        return false;
      }
    }
    return true;
  }

  linearSearch(targetValue) {
    let comparisons = 0;

    for (let i = 0; i < this.items.length; i++) {
      comparisons++;
      if (this.items[i].value === targetValue) {
        return { index: i, comparisons };
      }
    }

    return { index: -1, comparisons };
  }

  binarySearch(targetValue) {
    let comparisons = 0;
    let start = 0;
    let end = this.items.length - 1;

    while (start <= end) {
      const mid = Math.floor((start + end) / 2);
      comparisons++;

      if (this.items[mid].value === targetValue) {
        return { index: mid, comparisons };
      } else if (this.items[mid].value < targetValue) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return { index: -1, comparisons };
  }

  update(deltaTime) {
    this.items.forEach((item) => item.update(deltaTime));
  }

  draw(ctx) {
    ctx.strokeStyle = "#374151";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.width, this.height);

    for (const [i, item] of this.items.entries()) {
      const { x, y } = this.slotPosition(i);

      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, this.cellSize, this.cellSize);
      ctx.setLineDash([]);

      ctx.fillStyle = "#374151";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      ctx.fillText(`[${i}]`, x + this.cellSize / 2, this.y + this.height + 8);

      item.draw(ctx);
    }
  }
}

class CanvasApp {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    const capacity = 10;
    const cellSize = 60;
    const padding = 10;
    const width = capacity * (cellSize + padding) + padding;

    this.array = new ArrayContainer(
      (canvas.width - width) / 2,
      130,
      capacity,
      cellSize,
      padding
    );

    this.lastTime = 0;
    requestAnimationFrame((t) => this.loop(t));
  }

  get spawnPoint() {
    return { x: this.canvas.width / 2 - this.array.cellSize / 2, y: 10 };
  }

  addValue(value) {
    const { x, y } = this.spawnPoint;
    return this.array.add(value, x, y);
  }

  addValueSorted(value) {
    const { x, y } = this.spawnPoint;
    return this.array.insertSorted(value, x, y);
  }

  loop(time) {
    const deltaTime = time - this.lastTime;
    this.lastTime = time;

    this.array.update(deltaTime);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.array.draw(this.ctx);
  }
}

// =====================================================
// FormController
// =====================================================
class FormController {
  constructor(elements, app) {
    this.form = elements.form;
    this.input = elements.input;
    this.btnInsertSorted = elements.btnInsertSorted;
    this.btnSort = elements.btnSort;
    this.inputSearch = elements.inputSearch;
    this.btnLinear = elements.btnLinear;
    this.btnBinary = elements.btnBinary;
    this.message = elements.message;
    this.app = app;

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));

    if (this.btnInsertSorted) {
      this.btnInsertSorted.addEventListener("click", () => this.handleInsertSorted());
    }

    if (this.btnSort) {
      this.btnSort.addEventListener("click", () => this.handleSort());
    }

    if (this.btnLinear) {
      this.btnLinear.addEventListener("click", () => this.handleSearch("linear"));
    }

    if (this.btnBinary) {
      this.btnBinary.addEventListener("click", () => this.handleSearch("binary"));
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const value = Number(this.input.value);
    if (this.input.value === "" || Number.isNaN(value)) {
      this.showMessage("Informe um valor numérico para inserir.");
      return;
    }

    const square = this.app.addValue(value);
    if (!square) {
      this.showMessage("O array está cheio.");
      return;
    }

    this.showMessage(`Valor ${value} inserido no final (índice ${this.app.array.items.length - 1}).`);
    this.input.value = "";
    this.input.focus();
  }

  handleInsertSorted() {
    const value = Number(this.input.value);
    if (this.input.value === "" || Number.isNaN(value)) {
      this.showMessage("Informe um valor numérico para inserir.");
      return;
    }

    const result = this.app.addValueSorted(value);
    if (!result) {
      this.showMessage("O array está cheio.");
      return;
    }

    this.showMessage(`Valor ${value} inserido ordenadamente no índice [${result.index}].`);
    this.input.value = "";
    this.input.focus();
  }

  handleSort() {
    if (this.app.array.items.length === 0) {
      this.showMessage("O array está vazio para ordenar.");
      return;
    }

    this.app.array.sort();
    this.showMessage("Array ordenado com sucesso!");
  }

  handleSearch(type) {
    const value = Number(this.inputSearch.value);
    if (this.inputSearch.value === "" || Number.isNaN(value)) {
      this.showMessage("Informe um valor numérico para buscar.");
      return;
    }

    if (this.app.array.items.length === 0) {
      this.showMessage("O array está vazio.");
      return;
    }

    let result;

    if (type === "linear") {
      result = this.app.array.linearSearch(value);
    } else if (type === "binary") {
      if (!this.app.array.isSorted()) {
        this.showMessage("Erro: A busca binária requer que o array esteja ordenado! Clique em 'Ordenar'.");
        return;
      }
      result = this.app.array.binarySearch(value);
    }

    const { index, comparisons } = result;

    if (index !== -1) {
      this.showMessage(`Elemento ${value} ENCONTRADO no índice [${index}]! (Comparações feitas: ${comparisons})`);
    } else {
      this.showMessage(`Elemento ${value} NÃO encontrado. (Comparações feitas: ${comparisons})`);
    }
  }

  showMessage(text) {
    this.message.textContent = text;
  }
}

// =====================================================
// Inicialização
// =====================================================
const app = new CanvasApp(document.getElementById("canvas"));

new FormController(
  {
    form: document.getElementById("form-valor"),
    input: document.getElementById("input-valor"),
    btnInsertSorted: document.getElementById("btn-inserir-ordenado"),
    btnSort: document.getElementById("btn-ordenar"),
    inputSearch: document.getElementById("input-busca"),
    btnLinear: document.getElementById("btn-busca-sequencial"),
    btnBinary: document.getElementById("btn-busca-binaria"),
    message: document.getElementById("mensagem")
  },
  app
);