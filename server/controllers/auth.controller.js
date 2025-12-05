import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Signup
 * body: { username, displayName, dob, phoneNumber, email, password }
 */
export const signup = async (req, res) => {
  try {
    const { username, displayName, dob, phoneNumber, email, password } = req.body;
    if (!username || !displayName || !dob || !phoneNumber || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // uniqueness checks
    const existing = await User.findOne({
      $or: [{ username }, { email }, { phoneNumber }]
    });
    if (existing) return res.status(400).json({ message: "username/email/phone already exists" });

    const pwHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      username,
      displayName,
      dob,
      phoneNumber,
      email,
      passwordHash: pwHash
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const out = user.toObject();
    delete out.passwordHash;
    res.status(201).json({ user: out, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Login via username|email|phone + password
 * body: { credential, password }
 */
export const login = async (req, res) => {
  try {
    const { credential, password } = req.body;
    if (!credential || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({
      $or: [{ username: credential }, { email: credential }, { phoneNumber: credential }]
    });
    if (!user) return res.status(400).json({ message: "Invalid credential or password" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credential or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const out = user.toObject();
    delete out.passwordHash;
    res.json({ user: out, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
