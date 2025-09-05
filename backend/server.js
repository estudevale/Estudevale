
import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();
const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({
    origin: 'https://estudevale.com',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

app.post('/login', async (req, res) => {
    const { credential } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        req.session.user = {
            name: payload.name,
            email: payload.email,
            picture: payload.picture
        };
        res.json({ success: true, user: req.session.user });
    } catch (err) {
        res.status(401).json({ success: false, error: 'Token inválido' });
    }
});

app.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

app.listen(3001, () => {
    console.log('Backend rodando na porta 3001');
});
