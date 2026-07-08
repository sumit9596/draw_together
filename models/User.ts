import mongoose, { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String }
}, { timestamps: true })

const User = (models.User as mongoose.Model<any>) || model('User', UserSchema)

export default User
