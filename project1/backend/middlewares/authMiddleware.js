import jwt from "jsonwebtoken";

//CREATE MIDDLEWARE FUNCTION
const verifyToken = (req,res,next)=>{
    //EXTRACT TOKEN AND EXCLUDE Bearer
    const token=req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        //JWT VERIFIES TOKEN AND FETCH PAYLOAD TO VARIABLE DATA
        const data = jwt.verify(token, process.env.SECRET_KEY)
        req.user = data
        //IF verifyToken SUCCEDS next() IS CALLED
        next()
     } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
}
export default verifyToken