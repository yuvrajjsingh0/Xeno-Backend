import { RequestHandler } from "express";
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
const dotenv = require('dotenv');

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

export const authenticateGoogleToken: RequestHandler = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload!;

    const jwtToken = jwt.sign(
      { userId: sub, email, name },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' } // JWT expiration time
    );

    res.status(200).json({ token: jwtToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid Google token' });
  }
};