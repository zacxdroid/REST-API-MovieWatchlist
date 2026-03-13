import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

export const authMiddleware = async (req, res, next) => {
    console.log("Middleware reached");  
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1]; // ["Bearer", "sjfufguegfuefef"]
    } else if (req.cookies?.jwt) { 
        token = req.cookies.jwt;
    };

    if (!token) { //If theres no value provided
        return res.status(401).json({ error: "No authorized."});
    };

    try {
        //Verify token and extract user ID. 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
        });

        if (!user) {
            return res.status(401).json({ error: "User no longer exists."});
        };

        req.user = user; //To access out of middleware, in the controllers. 
        next();
    } catch (err) {
        return res.status(401).json({ error: "No authorized. Token failed."});
    };
};

