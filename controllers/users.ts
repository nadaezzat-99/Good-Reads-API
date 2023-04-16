const jwt = require('jsonwebtoken');
import { User } from '../DB/schemaInterfaces';
const Users = require('../DB/models/user');
import { AppError } from '../lib/index';

const createToken = (user: User) => {
  const token = jwt.sign({ userName: user.userName, userId:user._id, role:user.role }, process.env.TOKEN_KEY, { expiresIn: '14d' });
  return token;
};

const create = (data: User) =>  Users.create(data);

const signIn = async (loginedUser: { userName: string; password: string }) => {
  const user = await Users.findOne({ userName: loginedUser.userName });
  if (!user) throw new AppError('un-authenticated', 401);
  const valid = user.verifyPassword(loginedUser.password);
  if (!valid) throw new AppError('un-authenticated', 401);
  return {token: createToken(user), user};
};

module.exports = {
  create,
  signIn,
};
