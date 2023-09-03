import Jwt  from 'jsonwebtoken';
export const JwtSecret = "somethingstronggoodandheavu"
export const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access token missing' });

    Jwt.verify(token, JwtSecret, (err, decoded) => {
        if (err)  {
          console.log(err)
        return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};
export const verifyUserAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access token missing' });

    Jwt.verify(token, JwtSecret, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        if (decoded) {
        req.user = decoded;
        if (decoded.role === "admin") {
        next();
        } else {
          return res.status(403).send("you are not admin");
        }
        } else {
          return res.status(403).send("please login first");
        }
    });
}
