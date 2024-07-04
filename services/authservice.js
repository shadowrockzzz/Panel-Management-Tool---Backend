// services/authService.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'
import config from '../config/config.js';
import User from '../model/user.js';

// Service functions for authentication
const registerUser = async (username, email, password) => {
  try {
    let user = await User.findOne({ email });
    if (user) {
      throw new Error('User already exists');
    }

    user = new User({ username, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    return { message: 'User registered successfully' };
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = async (email, password) => {
  try {
    let user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, config.tokens.jwtSecret, {
      expiresIn: config.tokens.jwtExpiration
    });

    return { token };
  } catch (err) {
    throw new Error(err.message);
  }
};

export {registerUser, loginUser}
