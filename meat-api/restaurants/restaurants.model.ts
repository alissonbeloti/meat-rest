import * as mongoose from 'mongoose'
import { Stream } from 'stream';
import * as bcrypt from 'bcrypt'
import { enviroment } from '../common/enviroment';

export interface MenuItem extends mongoose.Document {
    name: string,
    price: number,
}
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
})

export interface Restaurant extends mongoose.Document {
    name: string,
    menu: MenuItem[],
    password: string,
} //Interface para representar o documento user

const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3,
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false, //deixa fora das querys padrões
        default: []
    }
})

export const Restaurant = mongoose.model<Restaurant>('Restaurant', restSchema); //Generics para dizer que estamos exportando o documento Restaurant

//const saveMiddleware = function (next) {
//    const user: User = <User>this
//    if (!user.isModified('password')) {
//        next()
//    }
//    else {
//        hashPassword(user, next)
//    }
//}

//const updateMiddleware = function (next) {

//    if (!this.getUpdate().password) {
//        next()
//    }
//    else {
//        hashPassword(this.getUpdate(), next)
//    }
//}

//userSchema.pre('save', saveMiddleware)
//userSchema.pre('findOneAndUpdate', updateMiddleware)
//userSchema.pre('update', updateMiddleware)

