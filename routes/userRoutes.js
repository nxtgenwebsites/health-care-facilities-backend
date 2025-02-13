import express from 'express';
import { addUser, deleteUser, editUser, getAllUsers, getUser, loginUser } from '../controllers/userController.js';

const router = express.Router()

router.post('/add-user' , addUser);
router.put('/edit-user' , editUser);
router.get('/get-user' , getUser);
router.get('/get-all-users' , getAllUsers);
router.post('/login-user' , loginUser);
router.delete('/delete-user' , deleteUser);

export default router;