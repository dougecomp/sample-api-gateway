import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import isEmail from 'validator/lib/isEmail'
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts'

export interface IMongooseUserDocument extends mongoose.Document {
    name: string;
    email: string
    login: string;
    password: string;
}

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: [isEmail, 'Please fill a valid e-mail address']
  },
  login: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  }
},
{
  timestamps: true
})

schema.pre('save', function (this: IMongooseUserDocument, next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(this.password, salt)
    this.password = hash
  }

  return next()
})

schema.plugin(mongoosePagination)

const MongooseUserModel: Pagination<IMongooseUserDocument> = mongoose.model<IMongooseUserDocument, Pagination<IMongooseUserDocument>>('User', schema)

export { MongooseUserModel }
