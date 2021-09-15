const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var dotenv = require("dotenv");
const UserModel = require("../Models/UserModel");
require("dotenv").config();

router.get("/get", async (req, res) => {
  try {
    const userData = await UserModel.find().select(
      "name email createdAt updatedAt"
    );
    res.status(200).json({ status: true, data: userData });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

//GET ONE User BY ID
router.get("/:userId", async (req, res) => {
  console.log(req.params.userId);
  try {
    const userData = await UserModel.findById(req.params.userId).select(
      "name email createdAt updatedAt"
    );
    res.status(200).json({ status: true, data: userData });
  } catch (err) {
    res.status(400).json({ status: false, message: err });
  }
});

// User LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let User = await UserModel.findOne({ email });
    console.log(User);

    if (!User)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const isMatch = await bcrypt.compare(password, User.password);

    if (!isMatch)
      return res.json({ errors: [{ message: "Invalid Credentials" }] });

    const payload = {
      user: {
        email: email,
        id: User._id,
        userType: "User",
      },
    };
    jwt.sign(payload, process.env.JWT, function (err, token) {
      console.log(err, token);
      if (token) {
        res.status(200).json({
          status: true,
          data: {
            _id: User._id,
            name: User.name,
            email: User.email,
            createdAt: User.createdAt,
            updatedAt: User.updatedAt,
            token: token,
          },
        });
        console.log(token);
      } else {
        res
          .status(400)
          .json({ status: false, message: "Token not generated " });
      }
    });
  } catch (err) {
    res.status(400).json({ status: false, message: "Login failed" });
  }
});

//ADD User
router.post("/add", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const User = await UserModel.findOne({ email });
    console.log(name);
    if (User)
      return res.json({ status: true, message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHased = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      name: name,
      email: email,
      password: passwordHased,
    });
    console.log(newUser)
    await newUser.save()
    res.status(201).json({ status: true, message: "User added sucessfully" });
  } catch (err) {
    res
      .status(400)
      .json({ status: false, message: "User not added", error: err });
  }
});

module.exports = router;