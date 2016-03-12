import mongoose, { Schema } from 'mongoose';

const UserSchema = Schema({
  username: String,
  vkId: String,
  vkAccessToken: String
});

const user = mongoose.model('user', UserSchema);

export default user;
