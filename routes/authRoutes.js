import express from 'express'
const router = express.Router();
import sample from '../simple.js';
import authController from '../controllers/authController.js'
import authMiddleware from '../middleware/authmiddleware.js'

// API endpoints for authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// Example protected route (requires token)
router.get('/protected', authMiddleware, (req, res) => {
  res.send('You have access to this protected route');
});
router.get('/sample',(req,res)=>{
  res.status(200).send({message: "Everything is working"});
})
router.get('check',sample);
export default router;