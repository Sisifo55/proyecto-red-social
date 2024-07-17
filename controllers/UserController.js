const User = require('../models/User')

const UserController = {
 async register(req, res) {
   try {
     const user = await User.create(req.body)
     res.status(201).send({ message: 'Usuario registrado con exito', user })
   } catch (error) {
     console.error(error)
   }
 },
 async login(req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    }) 
    // verificar cuando el usuario no coincide
    if (!user) {
      return res.status(400).send({ message: 'Usuario o contraseña incorrectos' })
    }
    // Constante con la que comparo la contraseña que mete el usuario con la contraseña que está en la base de datos  
    const isMatch = bcrypt.compareSync(req.body.password, user.password)
    // A continuación lanza un error si la contraseña que mete el usuario no coincide con la que hay en la base de datos
    if (!isMatch) {
      return res.status(400).send({ message: 'Usuario o contraseña incorrectos' })
    }
// Si todo lo anterior es correcto me proporciona un token y me lanza un mensaje de bienvenida y sino me lanza un mensaje de error
    const token = jwt.sign({_id: user._id}, jwt_secret)
    if (user.tokens.length > 5) user.tokens.shift()
      user.tokens.push(token)
    await user.save()
    res.send({message: 'Hola fulanit@' + user.name, token })
  } catch (error) {
    res.send({message: 'no ha habido suerte'})
  }
 
 }
}
module.exports = UserController


