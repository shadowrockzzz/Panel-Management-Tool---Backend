import express from 'express'
const router = express.Router();
import authController from '../controllers/authController.js'
import authMiddleware from '../middleware/authmiddleware.js'

// API endpoints for authentication
router.post('/register', authController.register);
router.get('/login', authController.login);

// Example protected route (requires token)
router.get('/protected', authMiddleware, (req, res) => {
  res.send('You have access to this protected route');
});
router.get('/sample',(req,res)=>{
  res.status(200).send({message: "Everything is working"});
})
export default router;