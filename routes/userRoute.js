const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify } = req.body;

    //validation

    if (!email || !password || !passwordVerify)
      return res.status(400).json({ errorMessage: "Please enter all fields" });

    if (password.length < 6)
      return res.status(400).json({
        errorMessage: "Please enter password of atleast 6 char",
      });

    const existingUser = await User.findOne({ email });

    // hash the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    console.log(passwordHash);

    //save a new user acc to db

    const newUser = new User({
      email,
      passwordHash,
    });

    const savedUser = await newUser.save();

    //log the user in
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    );
    console.log(token);
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
