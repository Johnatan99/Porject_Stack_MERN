const postModel = require('../models/postModel')
const createPostController = async(req,res) =>{
    try{
        const {title, description} = req.body;
        //Validate
        if(!title || !description){
            return res.status(500).send({
                success:false,
                message:'Preencha os campos'
            })
        }
        const post = await postModel({
            title,
            description,
            postedBy: req.auth._id
        }).save();
        console.log(req);
        res.status(201).send({
            success:true,
            message:'Postagem criada com sucesso',
            post
        })
    }catch(error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:'API: Erro ao criar postagem',
            error
        })
    }
};
//Get all posts:
const getAllPostsController = async(req,res)=>{
    try{
        const posts = await postModel
        .find().populate('postedBy', "_id name")
        .sort({createdAt: -1});
        res.status(200).send({
            success:true,
            message:"Todos posts encontrados",
            posts,
        })
    }catch(error){
        console.log(error);
        req.status(500).send({
            success:true,
            message:'API: Erro ao buscar todos posts',
            error,
        });
    }
};

const getUserPostController = async (req, res) =>{
    try{
        const userPosts = await postModel.find({postedBy:req.auth._id});
        res.status(200).send({
            success:true,
            message:'User posts',
            userPosts,
        })
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'API: Erro ao buscar usuário: ',
        });
    }
};

//Delete post:
const deletePostController = async(req,res) =>{
    try{
        const {id} = req.params;
        await postModel.findByIdAndDelete({_id:id})
        res.status(200).send({
            success: true,
            message:"Postagem excluida com sucesso",
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: "API: Erro ao excluir postagem!",
            error,
        });
    }
};

//Update Post controller:
const updatePostController = async(req, res)=>{
    try{
        const {title, description} = req.body;
        var msg = ""
       //Post find:
       const post = await postModel.findById({_id:req.params.id});
       //Validation
       if(!title && !description){
            msg="Preencha o titulo e a descrição."
       } else if(!title){
            msg="Preencha o título."
       }else if(!title){
            msg="Preencha a descrição."
       } 
       if(msg!=""){
        return res.status(500).send({
            success:false,
            message:msg
        });
       }
       const updatedPost = await postModel.findByIdAndUpdate(
        {_id:req.params.id},
        {
            title: title || post?.title,
            description: description || post?.description
        },{new:true});
        res.status(200).send({
            success:true,
            message:'Post alterado com sucesso.',
            updatedPost
        });
    }catch(error){
        console.log(error);
        res.status().send({
            success:false,
            message:'API: Erro ao alterar postagem',
            error
        });
    }
};

module.exports = {
    createPostController,
    getAllPostsController,
    getUserPostController,
    deletePostController,
    updatePostController
};