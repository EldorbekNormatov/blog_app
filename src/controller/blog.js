const path = require("path")
const Io = require("../utils/io")
const Blogs = new Io(path.join( process.cwd(), "database", "blog.json" ))
const Module = require("../module/blogModule")
const jwt = require("jsonwebtoken")

const create = async (req, res) => {
    const {title, text} = req.body
    const token = req.headers.authorization.split(" ")[1]

    const read = await Blogs.read()
    const id = (read[read.length - 1]?.id || 0) + 1
    const {id: user_id} = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // const {id} = jwt.verify(token, process.env.JWT_SECRET_KEY)
    const newBlog = new Module(id, title, text, user_id)

    const data = read.length ? [...read, newBlog] : [newBlog]

    await Blogs.write(data)

    res.status(201).json({message: "success", data})
} 

const getAll = async (req, res) => {
    const read = await Blogs.read()

    const token = req.headers.authorization.split(" ")[1]
    const {id: user_id} = jwt.verify(token, process.env.JWT_SECRET_KEY);


    const add = read.map( (user) => {
         user.seen += 1
         if(user.user_id == user_id) {
            user.seen -= 1
         }
         return user
    })
    await Blogs.write(add)
    res.status(200).json({message: "success", add })
}

const getOne = async (req, res) => {
    const {id} = req.body
    const read = await Blogs.read()

    const token = req.headers.authorization.split(" ")[1]
    const {id: user_id} = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const find = read.find((user) => user.id == id)
    find.seen += 1
    const add = read.map( (user) => {  
        if(user.user_id == user_id) {
            if(user.seen > 0) {
                user.seen -= 1
            }
         }      
        return user
   })
   await Blogs.write(add)

    res.status(200).json({message: "success"})
}

const upd = async (req, res) => {
    const {id, title, text} = req.body
    const token = req.headers.authorization.split(" ")[1]
    const {id: user_id} = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const read = await Blogs.read()

    const findToken = read.find((user) => user.user_id == user_id)
    const findId = read.find((user) => user.id == id)

    if(findId && findToken) {
        const updBlog = read.map( (user) => {
            findId.title = title
            findId.text = text
            return user
        })
        await Blogs.write(updBlog)

    } else {
    res.status(401).json({message: "there is no permision to change"})
    }

    res.status(200).json({message: "success"})    
}

const del = async (req, res) => {
    const {id} = req.body
    const token = req.headers.authorization.split(" ")[1]
    const {id: user_id} = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const read = await Blogs.read()
    const findToken = read.find((user) => user.user_id == user_id)
    // const findId = read.find((user) => user.id == id)
    
        for(let i = 0; i < read.length; i++) {
            if(read[i].user_id == user_id) {
                if(read[i].id == id) {
                    const data = read.indexOf(read[i])
                    read.splice(data, 1)
    
                    await Blogs.write(read)
            
                    // console.log(data);
                } else {
                    res.status(402).json({message: "you can nor delete other's blog "})
                    
                }
            } 
           
        }
    
        res.status(204).json({message: "deleted"})

}


module.exports = {
    create,
    getAll,
    getOne,
    upd,
    del
}
