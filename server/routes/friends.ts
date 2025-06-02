import express from 'express';
import { getFriends, sendFriendRequest, acceptFriendRequest, removeFriend } from '../controllers/friendController';
import { auth } from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getFriends);
router.post('/request', auth, sendFriendRequest);
router.post('/:friendshipId/accept', auth, acceptFriendRequest);
router.delete('/:friendshipId', auth, removeFriend);

export default router; 