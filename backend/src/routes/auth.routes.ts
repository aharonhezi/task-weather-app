import { Router } from 'express';
import { register, login } from '../services/auth.service';
import { validate, registerSchema, loginSchema } from '../utils/validators';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = validate(registerSchema, req.body);
    const result = await register(data);
    
    res.status(201).json({
      success: true,
      data: result,
    });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = validate(loginSchema, req.body);
    const result = await login(data);
    
    res.status(200).json({
      success: true,
      data: result,
    });
  })
);

export default router;

