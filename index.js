const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const port = process.env.PORT || 5000;

const app = express();

//middleware
app.use(cors());
app.use(express.json()); //json parse korar jnno[ It parses incoming JSON requests and puts the parsed data in req.]

//accessToken varify korar jnno function
const verifyJWTtoken = (req, res, next) => {
  //next, means jeikhan thekey verifyJWTtoken function ta call hobey function successfully execute hobar por  jeikhan thekey verifyJWTtoken function call hoisey sheikhan thekey abr execution shuru hobey
  const authHeader = req.headers.authorization; //accessToken with bearer pabo user ar client side thekey
  // console.log('inside verify' ,authHeader)
  //access token jodi na thakey jei user req korsey tahley 'unauthorized'
  if (!authHeader) {
    return res.status(401).send({ message: "unauthorized" });
  }
  //jodi token pawa jay tahley token k bearer thekey split korey token ta nibo
  const token = authHeader.split(" ")[1];
  //console.log(token)
  //split korar por JWT token verify hobey
  jwt.verify(token, process.env.ACCESS_SECRET_TOKEN, (error, decoded) => {
    if (error) {
      return res.status(403).send({ message: "forbidden" });
    }
    req.decoded = decoded;
    next(); //je verifyJWTtoken func ta call korsey sheikhaney jeno firey jay atr jnno next() use kora hoisey
  });
};

app.get("/", (req, res) => {
  res.send("Hello from jwt server");
});

//auth api for assigning JWT token to valid/authenticated user
app.post("/login", (req, res) => {
  const user = req.body; //client side thekey jei data pathano hoy seita dhorar way holo 'req.body'
  console.log(user);

  //After completing all authentication related verification, server issue JWT token to user
  if (user.email === "user@gmail.com" && user.password === "123456") {
    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_SECRET_TOKEN,
      { expiresIn: "1h" } //token expiration time if token expired then that token becomes invalid
    );
    res.send({
      //user ar email jodi authenticated hoy tokhn e user k token supply dibey otherwise not
      success: true,
      accessToken: accessToken,
    });
  } else {
    res.send({ success: false }); //client side a response ta jabey
  }
});

app.get("/orders", verifyJWTtoken, (req, res) => {
  //console.log(req.headers.authorization) //with bearer accessToken will get here  and after gettng accessToken from client side user req ,server will verify token weather it comes from valid user or not
  //above part verifyJWTtoken function a kora hoisey now verifyJWTtoken function ta middletier hisabey call korlei 'bearer accessToken' ta get hobey

  res.send([
    { id: 1, item: "sunglass" },
    { id: 2, item: "shirt" },
  ]);
});

app.listen(port, () => {
  console.log("Listening to port", port);
});
