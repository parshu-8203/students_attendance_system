const jwt = require('jsonwebtoken');
module.exports.authenticate = (req, res, next) => {
    // console.log("in authentication",req.headers);
    const token = req.headers.authorization; 

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }
        req.admin = { email: decoded.email};
        next(); 
    });
}
