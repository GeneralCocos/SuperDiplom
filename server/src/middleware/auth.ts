import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Неверный формат токена' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Пользователь не найден' });
      }

      req.user = {
        userId: user._id.toString(),
        role: user.role
      };

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Неверный токен авторизации' });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Ошибка аутентификации' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Требуется авторизация' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора' });
  }

  next();
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }

    next();
  };
}; 