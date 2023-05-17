const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken"); // to create and use json web tokens
require("dotenv").config(); // to access data for .env file
const cookieParser = require("cookie-parser");

router.use(cors());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(cookieParser());

// file paths
const viewFilesPath = path.join(__dirname, "..", "views"); // file path to views folder

// Json file paths
const usersData = path.join(__dirname, "..", "Json_files", "usersData.json");
const savingsData = path.join(__dirname, "..", "Json_files", "savings.json");
const creditcarsData = path.join(
  __dirname,
  "..",
  "Json_files",
  "creditcards.json"
);

// custom module imports
const accNoGenerator = require("../util/acc_no");
const DT = require("../util/date_time");

// route to register page
router.get("/registerform", (req, res) => {
  res.sendFile(viewFilesPath + "/register.html");
});

// adding new user
router.post("/adduser", (req, res) => {
  const { firstname, lastname, username, password, email, contact, address } =
    req.body;

  const accNo = accNoGenerator.createAccNo();

  // creating user object
  const user = {
    firstname: firstname,
    lastname: lastname,
    account: accNo,
    username: username,
    password: password,
    email: email,
    contact: contact,
    address: address,
  };

  const getUsers = () => {
    try {
      const data = fs.readFileSync(usersData);
      return data.length === 0 ? [] : JSON.parse(data);
    } catch (err) {
      return [];
    }
  };

  const users = getUsers();

  users.push(user);

  fs.writeFile(usersData, JSON.stringify(users), (err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

// redirecting to home page
router.post("/login", (req, res) => {
  //getting username and password
  const { username, password } = req.body;
  // console.log(`My username is ${username} and ${password} is my password`);

  const data = fs.readFileSync(usersData);
  const users = JSON.parse(data);
  // console.log(users);

  const user = users.find((user) => {
    return user.username === username && user.password === password;
  });
  // console.log(user);

  if (user) {
    // creating jwt token
    const token = jwt.sign(
      {
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        accnumber: user.account,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1hr" }
    );
    // console.log(token);

    res.cookie("token", token);
    res.redirect("/dashboard");
  } else {
    res.redirect("/?error=Invalid%20username%20or%20password");
  }
});

// authorization verification
const validate = (req, res, next) => {
  const cookiesToken = req.cookies.token;

  try {
    const decoded = jwt.verify(cookiesToken, process.env.ACCESS_TOKEN_SECRET);
    const username = decoded.username;
    next();
  } catch (err) {
    res.redirect("/?error=session%20timed%20out");
  }
};

// routing to dashboard
router.get("/dashboard", validate, (req, res) => {
  const token = req.cookies.token;
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  const firstname = decoded.firstname;
  const lastname = decoded.lastname;
  const html = fs.readFileSync(viewFilesPath + "/dashboard.html", "utf8");
  const updateHtml = html.replace(
    '<p id="user"></p>',
    `<p id="user">${firstname} ${lastname}</p>`
  );

  res.send(updateHtml);
});

// routings to savings page
router.get("/savings", validate, (req, res) => {
  // res.sendFile(viewFilesPath + "/savings.html");

  //fetching all the data form the savings json file
  const data = fs.readFileSync(savingsData);

  //parsing the data and storing in a variable
  const transactions = JSON.parse(data);

  // console.log(transactions);

  //getting user account number
  const cookies = req.cookies.token;
  const decoded = jwt.verify(cookies, process.env.ACCESS_TOKEN_SECRET);
  const accNum = decoded.accnumber;
  const username = decoded.firstname + " " + decoded.lastname;

  // filtering transactions using acccount number
  const userTransactions = transactions.filter(
    (transaction) => transaction.account === accNum
  );

  // calculating total balance
  let totalBalance = 0;
  const getTotalBalance = userTransactions.map((transaction) => {
    if (transaction.type === "debit") {
      totalBalance -= transaction.amount;
    } else {
      totalBalance += transaction.amount;
    }
    return { ...transaction, balance: totalBalance };
  });

  // console.log(getTotalBalance);

  // passing the data to the response object with, html page
  res.render(viewFilesPath + "/savings.ejs", {
    transactions: getTotalBalance,
    username,
  });
  // res.render(viewFilesPath + "/savings.ejs");
});

// routte to deposit money
router.post("/deposit", validate, (req, res) => {
  let amount = req.body.amount;
  // console.log(typeof amount);
  amount = Number(amount);

  //getting user account number
  const cookies = req.cookies.token;
  const decoded = jwt.verify(cookies, process.env.ACCESS_TOKEN_SECRET);
  const accNum = decoded.accnumber;
  const username = decoded.firstname + " " + decoded.lastname;

  //fetching all the data form the savings json file
  const data = fs.readFileSync(savingsData);
  const transactions = JSON.parse(data);

  const { date, time } = DT.dateAndTime();

  const transaction = {
    account: accNum,
    type: "credit",
    amount: amount,
    date: date,
    time: time,
  };

  transactions.push(transaction);

  fs.writeFile(savingsData, JSON.stringify(transactions), (err) => {
    if (err) throw err;
    res.redirect("/savings");
  });
});

// route to withdraw money
router.post("/withdraw", validate, (req, res) => {
  let amount = req.body.amount;
  let totalBalance = req.body.totalBalance;
  console.log(req.body);
  amount = Number(amount);
  totalBalance = Number(totalBalance);

  if (amount <= totalBalance) {
    //getting user account number
    const cookies = req.cookies.token;
    const decoded = jwt.verify(cookies, process.env.ACCESS_TOKEN_SECRET);
    const accNum = decoded.accnumber;
    const username = decoded.firstname + " " + decoded.lastname;

    //fetching all the data form the savings json file
    const data = fs.readFileSync(savingsData);
    const transactions = JSON.parse(data);

    const { date, time } = DT.dateAndTime();

    const transaction = {
      account: accNum,
      type: "debit",
      amount: amount,
      date: date,
      time: time,
    };

    transactions.push(transaction);

    fs.writeFile(savingsData, JSON.stringify(transactions), (err) => {
      if (err) throw err;
      res.redirect("/savings");
    });
  } else {
    // else part has to be implemented
  }
});

//route to transfer amount
router.post("/transfer", validate, (req, res) => {
  // request body data
  let { accnum, amount, totalBalance } = req.body;
  amount = Number(amount);
  // getting all users data
  const data = fs.readFileSync(usersData);
  const users = JSON.parse(data);

  const user = users.filter((user) => user.account === accnum);

  if (user.length !== 0) {
    if (amount <= totalBalance) {
      // fetching jwt token data
      const cookies = req.cookies.token;
      const decoded = jwt.verify(cookies, process.env.ACCESS_TOKEN_SECRET);
      const userAccNum = decoded.accnumber;

      //fetching all the data form the savings json file
      const data = fs.readFileSync(savingsData);
      const transactions = JSON.parse(data);

      const { date, time } = DT.dateAndTime();

      const transaction1 = {
        account: userAccNum,
        type: "debit",
        amount: amount,
        date: date,
        time: time,
      };
      const transaction2 = {
        account: accnum,
        type: "credit",
        amount: amount,
        date: date,
        time: time,
      };

      transactions.push(transaction1, transaction2);

      fs.writeFile(savingsData, JSON.stringify(transactions), (err) => {
        if (err) throw err;
        res.redirect("/savings");
      });
    }
  } else {
    console.log("not found user");
  }
});

// route to credit cards page
router.get("/creditcards", validate, (req, res) => {
  //getting user account number
  const cookies = req.cookies.token;
  const decoded = jwt.verify(cookies, process.env.ACCESS_TOKEN_SECRET);
  const accNum = decoded.accnumber;
  const user = decoded.firstname + " " + decoded.lastname;

  const creditCardsData = fs.readFileSync(creditcarsData);
  if (!creditCardsData || creditCardsData.length === 0) {
    res.render(viewFilesPath + "/creditcards.ejs", {
      cards: "NO CARDS FOUND....",
    });
  } else {
    const creditCards = JSON.parse(creditCardsData);
    // console.log(creditCards);

    const userCards = creditCards.filter((card) => card.account === accNum);
    // console.log(userCards);

    let id = 1;
    const cards = userCards.map((card) => {
      const selector = "card" + id;
      const cnumber = String(card.cardnumber);
      const cnum1 = cnumber.slice(0, 4);
      const cnum2 = cnumber.slice(4, 8);
      const cnum3 = cnumber.slice(8, 12);
      const cnum4 = cnumber.slice(12, 16);
      id++;

      return {
        ...card,
        cnum1: cnum1,
        cnum2: cnum2,
        cnum3: cnum3,
        cnum4: cnum4,
        user: user,
        card: selector,
      };
    });

    // console.log(cards);

    res.render(viewFilesPath + "/creditcards.ejs", { cards });
  }
});

// route to add new card
router.post("/addCard", validate, (req, res) => {
  const { cardnumber, cvv, expdate, type } = req.body;

  //getting user account number
  const cookies = req.cookies.token;
  const decoded = jwt.verify(cookies, process.env.ACCESS_TOKEN_SECRET);
  const accNum = decoded.accnumber;

  const card = {
    account: accNum,
    cardnumber: cardnumber,
    expdate: expdate,
    cvv: cvv,
    limit: 100000,
    availableAmount: 100000,
    type: type,
    duedate: "nan",
    dueamount: 0,
  };

  const getCards = () => {
    try {
      // fetching cards data
      const creditCardsData = fs.readFileSync(creditcarsData);
      return creditCardsData.length === 0 ? [] : JSON.parse(creditCardsData);
    } catch (err) {
      return [];
    }
  };

  const creditCards = getCards();

  creditCards.push(card);

  fs.writeFile(creditcarsData, JSON.stringify(creditCards), (err) => {
    if (err) throw err;
    res.redirect("/creditcards");
  });
});

// route for swipe
router.post("/swipe", validate, (req, res) => {
  const { amount, cardnumber } = req.body;
  console.log(amount, cardnumber);

  const cardsData = fs.readFileSync(creditcarsData);
  const userCards = JSON.parse(cardsData);

  // console.log(userCards.dueamount);
  const card = userCards.filter((card) => card.cardnumber === cardnumber);

  if (card.length != 0) {
    let availableAmount = card[0].availableAmount;
    console.log(availableAmount);

    if (Number(amount) <= Number(availableAmount)) {
      let currentDueAmount = Number(card[0].dueamount);
      // console.log(currentDueAmount + " is current due amount");
      let dueamount = currentDueAmount + Number(amount);
      // console.log(dueamount + " is being swiped");

      card[0].dueamount = dueamount;

      const { date, time } = DT.dateAndTime();
      let year = date.slice(0, 4);
      // console.log(year);
      let month = Number(date.slice(5, 7)) + 2;
      // console.log(month);
      if (month - 1 === 12) {
        year = Number(year) + 1;
      }
      let duedate = 05 + "/" + month + "/" + year;

      card[0].availableAmount -= dueamount;
      card[0].duedate = duedate;

      fs.writeFile(creditcarsData, JSON.stringify(userCards), (err) => {
        if (err) throw err;
        res.redirect("/creditcards");
      });
    }
  }
});

// route for pay bill
router.post("/paydue", validate, (req, res) => {
  const { amount, cardnumber } = req.body;
  // console.log(amount, cardnumber);

  const cardsData = fs.readFileSync(creditcarsData);
  const userCards = JSON.parse(cardsData);

  const card = userCards.filter((card) => card.cardnumber === cardnumber);

  if (card.length != 0) {
    let availableAmount = card[0].availableAmount;
    console.log(availableAmount + " is avilable before payment");

    let currentDueAmount = Number(card[0].dueamount);
    // console.log(currentDueAmount + " is current due amount");

    let dueamount = currentDueAmount - Number(amount);
    // console.log(dueamount + " is remaining due amount");

    card[0].dueamount = dueamount;
    card[0].availableAmount += Number(amount);
    console.log(card[0].availableAmount + " is avilable after payment");

    if (card[0].availableAmount === 100000) {
      card[0].duedate = "Na";
    }

    fs.writeFile(creditcarsData, JSON.stringify(userCards), (err) => {
      if (err) throw err;
      res.redirect("/creditcards");
    });
  }
});

// route for card removal
router.post("/removeCard", validate, (req, res) => {
  const cardnumber = req.body.cardnumber;
  console.log(cardnumber);
});

// route for logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// route to login page
router.get("/", (req, res) => {
  res.sendFile(viewFilesPath + "/login.html");
});

module.exports = router;
