const router = require("express").Router();

const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jsonwebtoken = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email, //body kinaki server laii user le pathaune ho
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString(),


    });
    try {
        const savedUser = await newUser.save() //yo garda new user lai db ma save garxa (but async function ho yo)
        res.status(201).json(savedUser) //savedUser send gar vanya ho(201 = successfully created)
    } catch (error) {
        //for error 37:00
        res.status(500).json(error)
    }
})

//Login
router.post("/login", async (req, res) => {

    try {
        const user = await User.findOne({ username: req.body.username });
        // !user && res.status(401).json("Wrong Credentials")
        if (!user) { res.status(401).json('email does not exist in the DB'); return; }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_KEY
        )
        const OrginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8); // special key vako case ma .enc.UTF8\

        OrginalPassword !== req.body.password &&
            res.status(401).json("Wrong Password");


        //creating json web token 
        const accesstoken = jsonwebtoken.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },
            process.env.JWT_SECKEY,
            { expiresIn: "3d" }
        )
        const { password, ...others } = user._doc //._doc kinani yo mongo ma .doc vanne ma save vako hunxa so

        res.status(200).json({ ...others, accesstoken })//if sab okay then yo
    } catch (error) {
        res.status(500).json(error)

    }
})

module.exports = router