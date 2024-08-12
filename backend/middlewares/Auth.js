import jwt  from 'jsonwebtoken'

function roleBasedAccess(allowedRoles) {
  return (req, res, next) => {
   
    const token = req.headers.authorization?.split(' ')[1];
 console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
     
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log(decoded)
     
      if (allowedRoles.includes(decoded.role)) {
        
        req.user = decoded;
        next(); 
      } else {
        return res.status(403).json({ message: `Access denied!, Only ${ allowedRoles} can access this resource` });
      }
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };
}

export default roleBasedAccess;
