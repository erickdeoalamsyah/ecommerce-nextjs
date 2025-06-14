import express from 'express'

import { login, register, logout, refreshAccesToken } from '../controllers/authController';

const router = express.Router();

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh-token', refreshAccesToken);

export default router
