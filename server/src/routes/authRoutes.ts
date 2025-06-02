import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate } from '../middleware/auth';

const router = Router();

// Validation middleware
const validateRegistration = (req: any, res: any, next: any) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
  }

  if (username.length < 3) {
    return res.status(400).json({ message: 'Имя пользователя должно содержать минимум 3 символа' });
  }

  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    return res.status(400).json({ message: 'Некорректный email адрес' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Пароль должен содержать минимум 6 символов' });
  }

  next();
};

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Проверка существования пользователя
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ 
          message: 'Пользователь с таким email уже существует' 
        });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ 
          message: 'Пользователь с таким именем уже существует' 
        });
      }
    }

    // Создание нового пользователя
    const user = new User({
      username,
      email,
      password,
      role: 'user'
    });

    await user.save();

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'Пользователь успешно зарегистрирован',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Ошибка при регистрации пользователя' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Проверка обязательных полей
    if (!email || !password) {
      return res.status(400).json({ message: 'Email и пароль обязательны' });
    }

    // Поиск пользователя
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Проверка пароля
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный email или пароль' });
    }

    // Создание JWT токена
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Ошибка при входе' });
  }
});

router.get('/profile', authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Требуется авторизация' });
    }
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Ошибка при получении профиля' });
  }
});

router.post('/change-password', authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?.userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Проверка старого пароля
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный текущий пароль' });
    }

    // Хеширование нового пароля
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: 'Пароль успешно изменен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router; 