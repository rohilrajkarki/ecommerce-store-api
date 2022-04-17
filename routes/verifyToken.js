const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECKEY, (err, user) => {
            if (err) res.status(403).json("Token is not valid")
            req.user = user; //.user create garya ya(req.body xa req.header xa testaii req.user create garya)
            next();//function leave garna laii so that it goes to the router

        })

    } else {
        return res.status(401).json("Your are not authenticated")

    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        //parames taki "/:id" wala id use garna laii (id router bata lyakoho)
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();//if ok then run this function
        }
        else {
            res.status(403).json("You are not allowed to do that!")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        //parames taki "/:id" wala id use garna laii (id router bata lyakoho)
        if (req.user.isAdmin) {
            next();//if ok then run this function
        }
        else {
            res.status(403).json("Your are not allowed to do that!")
        }
    })
}
module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin }; //{} vitra kinaki yestoh aaru function ni banaune ho so