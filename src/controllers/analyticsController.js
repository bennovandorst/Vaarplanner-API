import User from '../models/User.js';

export const getAnalyticsData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'Administrator' });
    const userCount = totalUsers - adminCount;

    res.json({
      totalUsers,
      adminCount,
      userCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};