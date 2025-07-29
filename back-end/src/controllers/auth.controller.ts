import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ code: 'USER_NOT_FOUND', message: 'Email is incorrect or not registered.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ code: 'WRONG_PASSWORD', message: 'Password is incorrect.' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ code: 'BACKEND_ERROR', message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      email,
      password,
      name,
      // First user will be admin, rest will be regular users
      role: (await User.countDocuments()) === 0 ? 'admin' : 'user'
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const resetAdminCredentials = async (req: Request, res: Response) => {
  try {
    const { email, newName, newPassword, secretAnswer } = req.body;
    if (!email || !newName || !newPassword || !secretAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    const isSecretValid = await admin.compareSecretAnswer(secretAnswer);
    if (!isSecretValid) {
      return res.status(403).json({ message: 'Secret answer is incorrect' });
    }
    admin.name = newName;
    admin.password = newPassword;
    await admin.save();
    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating credentials' });
  }
};

export const verifyToken = async (req: Request, res: Response) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
