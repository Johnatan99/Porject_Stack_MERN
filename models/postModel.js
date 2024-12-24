const mongoose = require('mongoose');

//Schema
const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true ,'Necessário adicionar o título do post'],
    },
    description:{
        type:String,
        required:[true, 'Necessário adicionar a descrição do post']
    },
    postedBy:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
},{timestamps:true})

module.exports = mongoose.model('Post', postSchema)