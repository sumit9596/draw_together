import mongoose, { Schema, model, models } from 'mongoose'

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // add other project fields as needed
}, { timestamps: true })

const Project = (models.Project as mongoose.Model<any>) || model('Project', ProjectSchema)

export default Project
