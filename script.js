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
  currencySymbol: "€",
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
  currency: "AUD",
  locale: "en-AU",
};

const account4 = {
  owner: "Han Yue",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2020-11-01T13:15:33.035Z",
    "2020-11-30T09:48:16.867Z",
    "2021-01-04T06:04:23.907Z",
    "2021-01-07T14:18:46.235Z",
    "2021-01-09T16:33:06.386Z",
  ],
  currency: "CNY",
  locale: "zh-CN",
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

// calculate days passed

function calcDaysPassed(date1, date2) {
  const daysPassed = Math.trunc(
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24)
  );
  return daysPassed;
}

// format currency
function formattedCurrency(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

// format date time

const formattedDateTime = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  day: "numeric",
  month: "numeric",
  year: "numeric",
};

//imnplement timer

function startLogOutTimer() {
  let timer = 300;
  const tick = function () {
    const minutes = String(parseInt(timer / 60)).padStart(2, 0);
    const seconds = String(parseInt(timer % 60)).padStart(2, 0);

    labelTimer.textContent = `${minutes}:${seconds}`;

    if (timer === 0) {
      clearInterval(timerId);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = "Log in to get started";
      btnLogout.style.display = "none";
    }
    timer--;
  };
  tick();
  const timerId = setInterval(tick, 1000);
  return timerId;
}

// show time
function showTime(account) {
  const tick = function () {
    labelDate.textContent = new Intl.DateTimeFormat(
      account.locale,
      formattedDateTime
    ).format(new Date());
  };
  tick();
  const showTimeId = setInterval(tick, 1000);
  return showTimeId;
}

// display account
let showTimeID;

const displayAccount = function (account, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  // forEach on movements

  movs.forEach(function (value, index) {
    const type = value > 0 ? "deposit" : "withdrawal";
    const daysPassed = calcDaysPassed(
      new Date(),
      new Date(account.movementsDates[index])
    );

    // format transaction date

    let transactionDate;
    if (daysPassed === 0) {
      transactionDate = "TODAY";
    } else if (daysPassed === 1) {
      transactionDate = "YESTERDAY";
    } else if (daysPassed <= 7) {
      transactionDate = `${daysPassed} days ago`;
    } else {
      transactionDate = new Intl.DateTimeFormat(account.locale).format(
        new Date(account.movementsDates[index])
      );
    }

    // display movements

    const movementRow = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${transactionDate}</div>
    <div class="movements__value">${formattedCurrency(
      value,
      account.locale,
      account.currency
    )}</div>`;
    containerMovements.insertAdjacentHTML("afterbegin", movementRow);
  });

  // display balance

  account.balance = account.movements.reduce(
    (accumulator, value) => accumulator + value,
    0
  );
  labelBalance.textContent = formattedCurrency(
    account.balance,
    account.locale,
    account.currency
  );

  // display deposit

  const deposit = account.movements
    .filter((value) => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0);
  labelSumIn.textContent = formattedCurrency(
    deposit,
    account.locale,
    account.currency
  );

  // display cashout

  const withdrawal = account.movements
    .filter((value) => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0);

  labelSumOut.textContent = formattedCurrency(
    Math.abs(withdrawal),
    account.locale,
    account.currency
  );

  // display interest

  const surplus = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formattedCurrency(
    surplus,
    account.locale,
    account.currency
  );

  const firstName = account.owner.split(" ")[0];
  labelWelcome.textContent = `Welcome back, ${firstName}!`;

  btnLogout.style.display = "block";

  if (showTimeID) clearInterval(showTimeID);
  showTimeID = showTime(account);
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

let currentAccount, timer; // global variable

btnLogin.addEventListener("click", function (event) {
  event.preventDefault();

  currentAccount = accounts.find(
    (acc) =>
      acc.username === inputLoginUsername.value &&
      acc.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
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
  account.movementsDates.push(new Date().toISOString());
}

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();
  const amount = +inputTransferAmount.value;
  if (amount <= currentAccount.balance) {
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
  // reset timer
  clearInterval(timer);
  timer = startLogOutTimer();
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
  const loanAmout = +inputLoanAmount.value;
  const deposit = currentAccount.movements.filter((mov) => mov > 0);
  const checkedCondition = deposit.some((mov) => mov >= loanAmout * 0.1);
  if (loanAmout > 0) {
    setTimeout(function () {
      if (checkedCondition) {
        addTransaction(currentAccount, loanAmout);
        alert("You are granted this loan 🎉🎉🎉!!!");
        displayAccount(currentAccount);

        //reset timer
        clearInterval(timer);
        timer = startLogOutTimer();
      } else {
        alert("You are ineligible for this loan 😟😟😟!!!");
      }
    }, 2000);
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
