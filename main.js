//Inputs de la data a tomar del usuario
const $inputBill = document.querySelector("#amountBill");
const $inputPeople = document.querySelector("#people");

const $buttonReset = document.querySelector(".button-reset");
const $tipAmount = document.getElementById("contentAmountTip");
const $tipAmountTotal = document.getElementById("showTotalAmountPeople");

//Botones de los porcentajes-------
const arrayButtons = Array.from(
  document.querySelector(".container-button_tip").children,
);
//button 5% => arrayButtons[0]
//button 10% => arrayButtons[1]
//button 15% => arrayButtons[2]
//button 25% => arrayButtons[3]
//button 50% => arrayButtons[4]
//button custom => arrayButtons[5]
//------------------------------------

//Funciones helpers--------------------------------------------------------
const reset = () => {
  $inputBill.value = "1";
  $inputPeople.value = "1";
  $tipAmount.textContent = "0.00";
  $tipAmountTotal.textContent = "0.00";
  $buttonReset.classList.add("disabled");
  arrayButtons.at(-1).value = "";
};

let hasErrors = false;
const showError = (input, message) => {
  hasErrors = true;
  input.parentElement.classList.add("error");

  const labelError = input.parentElement.parentElement.querySelector("p");
  labelError.textContent = message;
};

const cleanMessageError = (input) => {
  input.parentElement.classList.remove("error");
  hasErrors = false;
  const labelError = input.parentElement.parentElement.querySelector("p");
  labelError.textContent = "";
};
const transformToNumber = (value) => {
  return parseFloat(value);
};

const showResult = (subAmount, amountTotal) => {
  $tipAmount.textContent = subAmount;
  $tipAmountTotal.textContent = amountTotal;
};

const transformElementsToNumbers = (bill, people, porcent) => {
  return {
    dinero: transformToNumber(bill),
    personas: transformToNumber(people),
    porcentaje: transformToNumber(porcent),
  };
};

const isInputEmpty = (input) => {
  return input.value == "";
};
//-----------------------------------------------------------------

//FUNCION PARA CALCULAR PROPINA
const calcularPropina = (amount = 0, numberPeople = 0, tip = 0) => {
  let monto, subTipAmount, tipAmount;

  subTipAmount = (amount * (tip / 100)) / numberPeople;
  tipAmount = amount * (tip / 100);
  monto = (amount + tipAmount) / numberPeople;

  const montosTotales = {
    sub: subTipAmount.toFixed(2),
    total: monto.toFixed(2),
    valor: 2.5,
  };

  return montosTotales;
};

//-----------------
[$inputBill, $inputPeople].forEach((input) => {
  input.addEventListener("input", (e) => {
    let value = parseInt(e.target.value);

    if (value === 0) showError(input, "Cant be zero");
    else if (value <= 0) showError(input, "Only positive");
    else cleanMessageError(input);
  });
});

arrayButtons.forEach((e, i) => {
  if (i !== arrayButtons.length - 1) {
    e.addEventListener("click", () => {
      if (!isInputEmpty($inputBill) && !isInputEmpty($inputPeople)) {
        $buttonReset.classList.remove("disabled");
        $buttonReset.removeAttribute("disabled");
        //$buttonReset.setAttribute("disabled", false);

        const { porcentaje, dinero, personas } = transformElementsToNumbers(
          $inputBill.value,
          $inputPeople.value,
          e.value,
        );
        const { sub, total } = calcularPropina(dinero, personas, porcentaje);
        if (hasErrors) return;
        return showResult(sub, total);
      }

      if (isInputEmpty($inputBill))
        return showError($inputBill, "Rellene este");
      if (isInputEmpty($inputPeople)) return showError($inputPeople, "Rellene");
      //en caso de que no sea verdad no haga nada
      //$inputPeople.value === "0" && alert("Rellene");
    });
  }

  e.addEventListener("keyup", (event) => {
    if (
      !isInputEmpty($inputBill) &&
      !isInputEmpty($inputPeople) &&
      event.keyCode === 13
    ) {
      $buttonReset.classList.remove("disabled");
      $buttonReset.removeAttribute("disabled");
      const { dinero, personas, porcentaje } = transformElementsToNumbers(
        $inputBill.value,
        $inputPeople.value,
        e.value,
      );
      const { sub, total } = calcularPropina(dinero, personas, porcentaje);

      if (isInputEmpty(e)) return showResult("0.00", "0.00");
      if (hasErrors) return;
      return showResult(sub, total);
    }
  });
});
$buttonReset.addEventListener("click", reset);
