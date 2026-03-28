import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
        if (err) {
            res.status(403).json({ message: "Invalid or expired token" });
            return;
        }
        req.user = user;
        next();
    });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    authenticateToken(req, res, () => {
        if (req.user?.role !== "ADMIN" && req.user?.role !== "SUPERADMIN") {
            res.status(403).json({ message: "Admin access required" });
            return;
        }
        next();
    });
};

export const requireSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    authenticateToken(req, res, () => {
        if (req.user?.role !== "SUPERADMIN") {
            res.status(403).json({ message: "Superadmin access required" });
            return;
        }
        next();
    });
};
