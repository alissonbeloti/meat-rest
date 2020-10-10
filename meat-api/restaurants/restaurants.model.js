"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
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
        select: false,
        default: []
    }
});
exports.Restaurant = mongoose.model('Restaurant', restSchema); //Generics para dizer que estamos exportando o documento Restaurant
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
//# sourceMappingURL=restaurants.model.js.map