"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//logout button

const btnLogout = document.querySelector(".logout__btn");

// implement sorting
// let counter = 0;

// functional programming

const displayAccount = function (account, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  movs.forEach(function (value, index) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const movementRow = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${new Date(
      account.movementsDates[index]
    ).toLocaleDateString()}</div>
    <div class="movements__value">${value.toFixed(2)} €</div>`;
    containerMovements.insertAdjacentHTML("afterbegin", movementRow);
  });

  const balance = account.movements.reduce(
    (accumulator, value) => accumulator + value,
    0
  );
  labelBalance.textContent = `${balance.toFixed(2)} €`;

  const deposit = account.movements
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0);
  labelSumIn.textContent = `${deposit.toFixed(2)} €`;

  const withdrawal = account.movements
    .filter((value) => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0);

  labelSumOut.textContent = `${Math.abs(withdrawal).toFixed(2)} €`;

  const surplus = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${surplus.toFixed(2)} €`;

  const firstName = account.owner.split(" ")[0];
  labelWelcome.textContent = `Welcome back, ${firstName}!`;

  btnLogout.style.display = "block";
};

const username = function (string) {
  const username = string
    .split(" ")
    .map((value) => value[0].toLowerCase())
    .join("");
  return username;
};

const clearLoginValue = function () {
  inputLoginUsername.value = "";
  inputLoginPin.value = "";
  inputLoginUsername.blur();
  inputLoginPin.blur();
  // counter = 0;
};

const clearTransferValue = function () {
  inputTransferTo.value = "";
  inputTransferAmount.value = "";
};

const clearCloseValue = function () {
  inputCloseUsername.value = "";
  inputClosePin.value = "";
};

const clearLoanValue = function () {
  inputLoanAmount.value = "";
};

accounts.forEach(function (acc) {
  acc.username = username(acc.owner);
});

// event handler
// implement login

let currentAccount; // global variable

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    (acc) =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    displayAccount(currentAccount);
    containerApp.style.opacity = 1;
  } else {
    alert("The username or PIN that you've entered doesn't match any account");
  }
  clearLoginValue();
});

// add logout button

btnLogout.addEventListener("click", function () {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = "Log in to get started";
  btnLogout.style.display = "none";
});

//implement transfer

function addTransaction(account, num) {
  account.movements.push(num);
  account.movementsDates.push(new Date());
}

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  if (amount <= parseInt(labelBalance.innerText)) {
    const receivingAcc = accounts.find(
      (acc) => acc.username === inputTransferTo.value
    );
    if (receivingAcc) {
      if (amount <= 0 || typeof amount !== "number") {
        alert("Invalid amount ⛔️⛔️⛔️!!!");
      } else if (currentAccount.username === receivingAcc.username) {
        alert("Invalid receiving account ⛔️⛔️⛔️!!!");
      } else {
        addTransaction(currentAccount, -amount);
        addTransaction(receivingAcc, amount);
        displayAccount(currentAccount);
      }
    } else {
      alert("Receiving account doesn't exist ⛔️⛔️⛔️!!!");
    }
  } else {
    alert("NOT ENOUGH MONEY");
  }
  clearTransferValue();
});

//implement close account

btnClose.addEventListener("click", function (event) {
  event.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const indexCurrentAccount = accounts.findIndex(
      (acc) =>
        acc.username === currentAccount.username &&
        acc.pin === currentAccount.pin
    );
    accounts.splice(indexCurrentAccount, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = "Log in to get started";
    btnLogout.style.display = "none";
    alert("You closed the account successfully 👍👍👍!!!");
  } else {
    alert("Invalid confirmation ⛔️⛔️⛔️!!!");
  }
  clearCloseValue();
});

// implement request loan

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();
  const loanAmout = Number(inputLoanAmount.value);
  const deposit = currentAccount.movements.filter((mov) => mov > 0);
  const checkedCondition = deposit.some((mov) => mov >= loanAmout * 0.1);
  if (loanAmout > 0) {
    if (checkedCondition) {
      addTransaction(currentAccount, loanAmout);
      alert("You are granted this loan 🎉🎉🎉!!!");
      displayAccount(currentAccount);
    } else {
      alert("You are ineligible for this loan 😟😟😟!!!");
    }
  } else {
    alert("Invalid amount ⛔️⛔️⛔️!!!");
  }

  clearLoanValue();
});

let sorted = false;
btnSort.addEventListener("click", function (event) {
  event.preventDefault();
  displayAccount(currentAccount, !sorted);
  sorted = !sorted;
});
