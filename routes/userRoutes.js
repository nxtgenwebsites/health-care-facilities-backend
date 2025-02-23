import express from 'express';
import { addUser, blockUser, deleteUser, editUser, getAllUsers, getUser, loginUser, passwordDetails } from '../controllers/userController.js';
import authenticateToken from '../controllers/authenticateToken.js';
import { sendLoginDetails } from '../controllers/userController.js';

const router = express.Router()

router.post('/add-user' , addUser);
router.put('/edit-user' , editUser);
router.get('/get-user' ,  getUser);
router.get('/get-all-users' , getAllUsers);
router.post('/login-user' , loginUser);
router.delete('/delete-user' , deleteUser);
router.put('/block-user', blockUser);
router.post('/send-details',authenticateToken , sendLoginDetails);
router.post('/password-details' , passwordDetails);


export default router;