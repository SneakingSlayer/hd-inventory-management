const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) =>{
   const bearerHeader = req.headers['Authorization'];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader;
        jwt.verify(bearer, process.env.TOKEN_SECRET, (err, ver) => {
            if(err){
                console.log(err.message)
                res.status(403).send(err.message)
                next()
            }
            else{
                next()
            }
        })
    }
    else{
        res.sendStatus(403)
    }
}

module.exports = verifyToken;