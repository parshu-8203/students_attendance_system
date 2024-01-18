const jwt = require('jsonwebtoken');
module.exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization; // Assuming the token is sent in the Authorization header

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
