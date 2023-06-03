const path = require("path")
const Io = require("../utils/io")
const Users = new Io(path.join( process.cwd(), "database", "user.json")) 
const Module = require("../module/userModule")
// const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken")


const register = async (req, res) => {
    const{name, password, email } = req.body

    const read = await Users.read()    

    const id = (read[read.length - 1]?.id || 0) +1

    const user = new Module(id, name, password, email)
    const newUser = read.length ? [...read, user] : [user]
    const findName = read.find( (u) => u.name == name)
    const findEmail = read.find( (u) => u.email == email)

    if(!findName || findEmail ) {
        await Users.write(newUser)
         
     const secretKey = process.env.JWT_SECRET_KEY;
     const token = jwt.sign({id: user.id}, secretKey);
        res.status(201).json({message: "success", token})

    } else if (findName || findEmail) {
        res.status(401).json({message: "this username or email already token"})
    }
    
   
}

const login = async (req, res) => {
    const {name, password} = req.body

    const read = await Users.read()       

    const findName = read.find( (u) => u.name == name)
    const findpassword = read.find( (u) => u.password == password)
    
    if(findName && findpassword) {
        res.status(201).json({message: "you are successfully logged"})
    } else {
        res.status(201).json({message: "username or password not true"})
    }
    
    res.status(201).json({message: "success"})
}

module.exports = {
    register,
    login,
}