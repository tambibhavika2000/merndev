require("dotenv").config();
const express = require("express");
require("./db/conn");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const hbs = require("hbs");
const User = require("./models/registers");
const bcrypt = require('bcrypt');
const cookieParser=require("cookie-parser");
const auth=require("./middleware/auth");
// ******************for serving static files***************************
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
// ********************************************************************
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/secret",auth, (req, res) => {
    res.render("secret");
});

app.post("/login", async (req, res) => {
    try {
        const lemail = req.body.lemail;
        const password = req.body.password;
        const myuser = await User.findOne({ email: lemail });
        const isMatch = await bcrypt.compare(password, myuser.password);
        const token = await myuser.generatetoken();
        res.cookie("jwt", token, { httpOnly: true });

        if (!myuser) {
            res.send("Register First");
        }
        else if (isMatch) {
            res.send("Ok logged in");
        } else {
            res.send("Invalid");
        }

    }
    catch (e) {
        res.send(e);
    }
})

app.post("/register", async (req, res) => {
    try {
        const pwd = req.body.pwd;
        const cpwd = req.body.cpwd;
        if (pwd === cpwd) {

            const user = new User({
                name: req.body.name, email: req.body.email,
                password: pwd,
                confirmpassword: cpwd,
            });

            const token = await user.generatetoken();
            res.cookie("jwt", token, { httpOnly: true });
            const register = await user.save();
            res.render('index');

        } else {
            res.send("password not matching !!")
        }

    }
    catch (e) {
        res.status(400).send(e);
    }
})


app.listen(port, () => {
    console.log("Listening");
})