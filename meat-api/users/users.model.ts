﻿import * as mongoose from 'mongoose'
import { Stream } from 'stream';
import { validateCPF } from '../common/validator';
import * as bcrypt from 'bcrypt'
import { enviroment } from '../common/enviroment';
import { userInfo } from 'os';

export interface User extends mongoose.Document {
    matches(password: string): boolean,
    name: string,
    email: string,
    password: string,
    cpf: string,
    gender: string,
    profiles: string[]
    hasAny(...profiles: string[]): boolean //... => permite informar vários parametros e transforma em array
} //Interface para representar o documento user

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3,
    },
    email: {
        type: String,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: CPF Inválido ({VALUE})'
        }
    },
    profiles: {
        type: [String],
        required: false
    }
})

const hashPassword = (obj, next) => {
    bcrypt.hash(obj.password, enviroment.security.saltRounds)
        .then(hash => {
            obj.password = hash
            next()
        }).catch(next)
}

const saveMiddleware = function (next) {
    const user: User = <User>this
    if (!user.isModified('password')) {
        next()
    }
    else {
        hashPassword(user, next)
    }
}

const updateMiddleware = function (next) {

    if (!this.getUpdate().password) {
        next()
    }
    else {
        hashPassword(this.getUpdate(), next)
    }
}

userSchema.pre('save', saveMiddleware)
userSchema.pre('findOneAndUpdate', updateMiddleware)
userSchema.pre('update', updateMiddleware)
userSchema.statics.findByEmail = function (email: string, projection: string) {
    return this.findOne({ email }, projection)
}
userSchema.methods.matches = function (password: string): boolean {
    return bcrypt.compareSync(password, this.password)
}
userSchema.methods.hasAny = function (...profiles: string[]): boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1)
}
export const User = mongoose.model<User, UserModel>('User', userSchema); //Generics para dizer que estamos exportando o documento User