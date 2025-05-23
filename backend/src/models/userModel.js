// In-memory database for users
const users = [];
let nextUserId = 1;

const createUser = (userData) => {
  const user = {
    id: nextUserId++,
    name: userData.name,
    email: userData.email,
    password: userData.password, // should be hashed before storing
    charlasRegistradas: []
  };
  users.push(user);
  return user;
};

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const findUserById = (id) => {
  return users.find(user => user.id === parseInt(id));
};

const registerUserToTalk = (userId, talkId) => {
  const user = findUserById(userId);
  if (user && !user.charlasRegistradas.includes(talkId)) {
    user.charlasRegistradas.push(talkId);
    return true;
  }
  return false;
};

const unregisterUserFromTalk = (userId, talkId) => {
  const user = findUserById(userId);
  if (user) {
    const index = user.charlasRegistradas.indexOf(talkId);
    if (index !== -1) {
      user.charlasRegistradas.splice(index, 1);
      return true;
    }
  }
  return false;
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  registerUserToTalk,
  unregisterUserFromTalk,
  users
};