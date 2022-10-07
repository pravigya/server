const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//register
router.post("/", async (req, res) => {
  try {
    const { email, password, passwordVerify , phoneNo  } = req.body;

    //validation

    if (!email || !password || !passwordVerify || !phoneNo)
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
      phoneNo
    });

    const savedUser = await newUser.save();

    //sign the token
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

//log in

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //validate
    if (!email || !password)
      return res.status(400).json({ errorMessage: "Please enter all fields" });

    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(401).json({ errorMessage: "Wrong email or password" });

    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: "Wrong email or password" });

    //sign the token
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );
    console.log(token);
    //send the token in a http only cookie
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

router.get("/logout", (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Data(0),
    })
    .send();
});

router.get("/loggedIn", (req, res) => {
  try {
    const token = req.cookie.token;

    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWR_SECRET);
    res.send(true);
  } catch (err) {
    res.json(false);
  }
});

module.exports = router;
