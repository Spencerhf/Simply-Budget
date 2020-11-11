const { response } = require("express");
const express = require("express");
const router = express.Router();
const db = require("../models");

// For bcrypt
const saltRounds = 10;
const bcrypt = require("bcrypt");
let userLoggedIn = false;

function authenticationMiddleware(req, res, next) {
  if (userLoggedIn) {
    console.log("User logged in.");
    next();
  } else {
    console.log("User not authenticated");
    res.redirect("/login");
  }
}


      ///////////////
      /////Users/////
      ///////////////


// Register a new user
router.post("/register", (req, res, next) => {
  if (!req.body.first_name) {
    res.status(404).send("First name is required");
  }
  if (!req.body.last_name) {
    res.status(404).send("Last name is required");
  }
  if (!req.body.email) {
    res.status(404).send("Email is required");
  }
  if (!req.body.password) {
    res.status(404).send("Password is required");
  }
  if (isNaN(req.body.income) || !req.body.income) {
    res.status(409).send("Valid income is required");
    return;
  }
  let first_name = req.body.first_name;
  let last_name = req.body.last_name;
  let email = req.body.email;
  let password = req.body.password;
  let income = req.body.income;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    let encrypted_password = hash;
    db.users
      .create({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: encrypted_password,
        income: income,
      })
      .then((results) => {
        res.json(results);
      })
      .catch((e) => {
        res.status(409).send("Please input valid data.");
        console.log(e);
      });
  });
});


// Login to an existing account
router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  db.users
    .findAll({
      where: {
        email: email,
      },
    })
    .then((user) => {
      if (!req.body.email) {
        res.status(404).send("Email is required");
      }
      if (!req.body.password) {
        res.status(404).send("Password is required");
      }
      let storedPassword = user[0].password;

      bcrypt.compare(password, storedPassword, function (err, result) {
        if (result) {
          res.json(user);
        } else { 
          res.status(409).send("Incorrect password"); 
        }
      });
    })
    .catch((e) => { res.status(404).send("Email/Password combination did not match") });
});


// Update an existing user
router.put("/user/:id", (req, res) => {
  if(isNaN(req.body.income)) {
    res.send("Enter a number");
  }

  db.users
    .update(
      { income: req.body.income },
      {
        where: {
          id: req.params.id,
        },
      })
    .then((user) => res.json(user))
    .catch((err) => res.send(err));
});


      ///////////////
      /////Bills/////
      ///////////////


// Create a bill
router.post("/bills/create/:id", (req, res) => {
  if(!req.body.bill_name) {
    res.status(409).send('Please enter the bill name');
  }
  if(!req.body.bill_amount || isNaN(req.body.bill_amount)) {
    res.status(409).send('Please enter bill amount')
  }

  db.bills
    .create(
      { 
        bill_name: req.body.bill_name,
        bill_amount: req.body.bill_amount,
        user_id: req.params.id
      })
    .then((user) => res.json(user))
    .catch((err) => res.send(err));
});


// Get all of the logged in users bills
router.get("/bills/:id", (req, res) => {
  db.bills
    .findAll({
      where: {
        user_id: req.params.id
      }
    })
    .then((bills) => res.json(bills))
    .catch((err) => res.send(err))
})


// Get a single bill
router.get("/bills/:id", (req, res) => {
  db.bills
    .findAll({
      where: {
        id: req.params.idd
      }
    })
    .then((bills) => res.json(bills))
    .catch((err) => res.send(err))
})


// Update a bill
router.put("/bills/update/:id", (req, res) => {
  if(req.body.bill_amount && isNaN(req.body.bill_amount)) {
    res.send('Please enter a number');
    return;
  }

  db.bills
    .update(
      { 
        bill_name: req.body.bill_name,
        bill_amount: req.body.bill_amount
      },
      {
        where: {
          id: req.params.id
        },
      })
    .then((user) => res.json(user))
    .catch((err) => res.send(err));
});


// Delete a bill
router.delete("/bills/delete/:id", (req, res) => {
  db.bills
    .destroy({
      where: {
        id: req.params.id,
      },
    })
    .then(() => res.send("success"))
    .catch(() => res.send("fail"));
});


//Backend running
router.get("/", (req, res) => {
  res.send("Backend running!");
});

module.exports = router;
