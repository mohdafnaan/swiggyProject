import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

function middleware(req,res,next){
    try {
        let token = req.headers.authorization?.split(' ')[1];
        if(!token){
            res.status(400).json({msg : "invalid token"})
        }

        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decode
        // console.log(req.user);

        next()
    } catch (error) {
        console.log(error);
    }
}

export default middleware