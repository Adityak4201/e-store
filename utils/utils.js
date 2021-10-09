function getCleanUser(user) {
  return {
    roll: user.roll,
    status: user.status,
    _id: user._id,
    email: user.email,
    phone: user.phone,
  };
}

module.exports = { getCleanUser };
