function getCleanUser(user) {
  return {
    role: user.role,
    status: user.status,
    _id: user._id,
    email: user.email,
    profile_username: user.profile_username,
    username: user.username,
    phone: user.phone,
  };
}

module.exports = { getCleanUser };
