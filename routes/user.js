const User = require("../models/User");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();

//{ yo bracket vitra ko test ko lagi ho
// router.get("/usertest", (req, res) => {
//     console.log("user test is sucessfull")
// })

// //post mehtod use garda aafno user/client sanga kei request linxam (eg username line)
// router.post("/userposttest", (req, res) => {
//     //body wala chaii hamile server laii pass garne kura ho-
//     //-(sab body kaii through hunxa pass)
//     //body chaii kei username,email(kei input )pass garda body lekhne ho -
//     const username = req.body.username
//     res.send("your username is:" + username)
//     console.log(username)
// })
// }

//put kinaki we are updating
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    //if user wants to change password
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_KEY).toString()
    }
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            //ya chaii k update garna lagya tyo lekhne
            //req body ko sab kura line ani set it again 
            //new true taki updated user return garos
            $set: req.body
        },
            { new: true }
        );
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Delete
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted")

    } catch (error) {
        res.status(500).json(error)

    }
})

//Get User
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const { password, ...others } = user._doc
        res.status(200).json(others)

    } catch (error) {
        res.status(500).json(error)

    }
})

//Get All Users
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
        const users = query
            ? await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();
        res.status(200).json(users)

    } catch (error) {
        res.status(500).json(error)

    }
})

//Get User Stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try {
        const data = await User.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router