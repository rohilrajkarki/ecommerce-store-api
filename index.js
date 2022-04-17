const express = require("express")
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth")
const productRoute = require("./routes/product")
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")
const postRoute = require("./routes/posts")
const multer = require("multer")
const path = require("path")

const cors = require('cors');
app.use(cors())
app.use("/images", express.static(path.join(__dirname, "/images")))

dotenv.config();

mongoose.connect(process.env.MONGO_URL
).then(() => console.log("DB Connection sucessful"))
    .catch((err) => {
        console.log(err)
    })


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});


const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});

//     //these are routes(testing)
// app.get("/api/test", () => {
//     console.log("Test is sucessfull")
// })

app.use(express.json())
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)
app.use("/api/cart", cartRoute)
app.use("/api/order", orderRoute)
app.use("/api/posts", postRoute)

app.listen(process.env.PORT || 5000, () => { //if there's no port in env then use 5000 vanya ya
    console.log("Backend running")
})

