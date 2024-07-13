import express from 'express'
const router = express.Router();
import authController from '../controllers/authController.js'
import authMiddleware from '../middleware/authmiddleware.js'
import panelController from '../controllers/panelController.js'
import slotController from '../controllers/slotController.js';

// API endpoints for authentication
router.post('/register', authController.register);
router.get('/login', authController.login);
router.get('/panel',panelController.getPanelData);
router.get('/getslots',slotController.getSlots);
router.post('/updateslots',slotController.updateSlots)
router.post('/addslot',slotController.addSlot)
router.get('/getslotsbypanel', slotController.getSlotsByPanel)
router.delete('/slot/:id',slotController.deleteSlot)
router.get('/allpanels',panelController.getAllPanels)

// Example protected route (requires token)
router.get('/protected', authMiddleware, (req, res) => {
  res.send('You have access to this protected route');
});
router.get('/sample',(req,res)=>{
  res.status(200).send({message: "Everything is working"});
})
export default router;