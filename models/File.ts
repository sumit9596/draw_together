// Defines persisted document and whiteboard content belonging to a workspace.
import mongoose, { Schema, model, models } from 'mongoose'

const FileSchema = new Schema({
  _id: { type: String, required: true, unique: true },
  fileName: { type: String, default: 'Untitled' },
  document: { type: String, default: '' },
  whiteboard: { type: String, default: '' },
  teamId: { type: String },
  createdBy: { type: String },
  edited: { type: Boolean, default: false },
  archive: { type: Boolean, default: false },
}, { timestamps: true })

const File = (models.File as mongoose.Model<any>) || model('File', FileSchema)

export default File
