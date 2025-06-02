import { Request, Response } from 'express';
import Friend, { IFriend } from '../models/Friend';
import User from '../models/User';

export const getFriends = async (req: Request, res: Response) => {
  try {
    const friends = await Friend.find({
      $or: [{ user: req.user._id }, { friend: req.user._id }],
      status: 'accepted'
    }).populate('user friend', 'username avatarUrl rating');

    const formattedFriends = friends.map(friendship => {
      const friendUser = friendship.user._id.toString() === req.user._id.toString()
        ? friendship.friend
        : friendship.user;

      return {
        _id: friendUser._id,
        username: friendUser.username,
        avatarUrl: friendUser.avatarUrl,
        rating: friendUser.rating,
        status: 'offline' // This should be updated with real-time status
      };
    });

    res.json(formattedFriends);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching friends' });
  }
};

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { friendId } = req.body;

    if (friendId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot add yourself as a friend' });
    }

    const existingFriendship = await Friend.findOne({
      $or: [
        { user: req.user._id, friend: friendId },
        { user: friendId, friend: req.user._id }
      ]
    });

    if (existingFriendship) {
      return res.status(400).json({ message: 'Friendship already exists' });
    }

    const friendship = new Friend({
      user: req.user._id,
      friend: friendId,
      status: 'pending'
    });

    await friendship.save();
    res.status(201).json(friendship);
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request' });
  }
};

export const acceptFriendRequest = async (req: Request, res: Response) => {
  try {
    const { friendshipId } = req.params;
    const friendship = await Friend.findOneAndUpdate(
      { _id: friendshipId, friend: req.user._id, status: 'pending' },
      { status: 'accepted' },
      { new: true }
    );

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    res.json(friendship);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting friend request' });
  }
};

export const removeFriend = async (req: Request, res: Response) => {
  try {
    const { friendshipId } = req.params;
    const friendship = await Friend.findOneAndDelete({
      _id: friendshipId,
      $or: [{ user: req.user._id }, { friend: req.user._id }]
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friendship not found' });
    }

    res.json({ message: 'Friend removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing friend' });
  }
}; 