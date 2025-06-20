let currentInput = "0";
let previousInput = "";
let operation = null;
let resetInput = false;
let activeOpBtn = null;

const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");

function updateDisplay() {
  display.textContent = currentInput;
  display.classList.toggle("text-3xl", currentInput.length > 10);
  display.classList.toggle("text-4xl", currentInput.length <= 10);

  historyDisplay.textContent =
    previousInput && operation
      ? `${previousInput} ${getOpSymbol(operation)}`
      : "";
}

const getOpSymbol = (op) =>
  ({ "+": "+", "-": "−", "*": "×", "/": "÷" }[op] || op);

const pressFx = (btn) => {
  btn.classList.add("btn-press");
  setTimeout(() => btn.classList.remove("btn-press"), 120);
};

function appendNumber(e, num) {
  pressFx(e.currentTarget);
  currentInput = resetInput || currentInput === "0" ? num : currentInput + num;
  resetInput = false;
  updateDisplay();
}

function appendDecimal(e) {
  pressFx(e.currentTarget);
  if (resetInput) {
    currentInput = "0.";
    resetInput = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay();
}

function clearAll(e) {
  pressFx(e.currentTarget);
  currentInput = "0";
  previousInput = "";
  operation = null;
  resetInput = false;
  if (activeOpBtn) activeOpBtn.classList.remove("operation-active");
  activeOpBtn = null;
  updateDisplay();
}

const toggleSign = (e) => {
  pressFx(e.currentTarget);
  currentInput = (-parseFloat(currentInput)).toString();
  updateDisplay();
};

const percentage = (e) => {
  pressFx(e.currentTarget);
  currentInput = (parseFloat(currentInput) / 100).toString();
  updateDisplay();
};

function setOperation(e, op) {
  pressFx(e.currentTarget);
  if (operation && !resetInput) calculate(e);
  previousInput = currentInput;
  operation = op;
  resetInput = true;
  if (activeOpBtn) activeOpBtn.classList.remove("operation-active");
  activeOpBtn = e.currentTarget;
  activeOpBtn.classList.add("operation-active");
  updateDisplay();
}

function calculate(e) {
  if (!operation || resetInput) return;
  if (e) pressFx(e.currentTarget);
  const prev = parseFloat(previousInput);
  const curr = parseFloat(currentInput);
  let result =
    operation === "+"
      ? prev + curr
      : operation === "-"
      ? prev - curr
      : operation === "*"
      ? prev * curr
      : prev / curr;
  currentInput = Number.isInteger(result)
    ? result.toString()
    : result.toFixed(8).replace(/\.?0+$/, "");
  operation = null;
  resetInput = true;
  if (activeOpBtn) activeOpBtn.classList.remove("operation-active");
  activeOpBtn = null;
  updateDisplay();
}

document.addEventListener("keydown", (k) => {
  if (/\d/.test(k.key)) appendNumber({ currentTarget: document.body }, k.key);
  else if (k.key === ".") appendDecimal({ currentTarget: document.body });
  else if (k.key === "Escape") clearAll({ currentTarget: document.body });
  else if (["+", "-", "*", "/"].includes(k.key))
    setOperation({ currentTarget: document.body }, k.key);
  else if (k.key === "%") percentage({ currentTarget: document.body });
  else if (k.key === "Enter" || k.key === "=")
    calculate({ currentTarget: document.body });
  else if (k.key === "_") toggleSign({ currentTarget: document.body });
});

updateDisplay();
