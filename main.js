const express = require('express')
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')

//const { Router } = express
const Contenedor = require('./contenedor.js')


const contenedor = new Contenedor('products.txt')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))



// EJS
app.set('views','./views')
app.set('view engine', 'ejs')



const PORT = 8080

const server = app.listen(PORT, () => {
  console.log(`Servidor HTTP escuchando en el puerto ${PORT}`)
})

server.on('error', error => console.log(`Error en servidor: ${error}`))



io.on('connection', socket => {
  console.log('Nuevo cliente conectado')


})

/* app.get('', async (req,res) =>{
  const products = await contenedor.getAll()

  const data ={
    products
  }
  return res.render('products', data) //EJS

}) */

app.get('/', async (req,res) =>{
  const products = await contenedor.getAll()
  const data ={
    products
  }
  return res.render('form', data) //EJS

})

app.post('/', async (req, res) => {
  const product = {
    title: req.body.title,
    price: req.body.price,
    thumbnail: req.body.thumbnail,
  }
 
  await contenedor.save(product)

  return res.redirect('/') //EJS
 
})

app.put('/:id', async (req, res)=>{

  const id = (Number(req.params.id))
  const products = await contenedor.getAll()
  const productIndex = products.findIndex(product=> product.id === id)

  if(productIndex === -1){
  return res.status(404).json({error : 'Producto no encontrado'})
  }
  const body = req.body

  products[productIndex].title = body.title
  products[productIndex].price = body.price
  products[productIndex].thumbnail = body.thumbnail 
  
  //cree esta funcion en contenedor.js para actualizar y no perder los id
  await contenedor.update(products[productIndex])
    
  return res.json(products)
})

app.delete('/:id', async (req,res)=>{
  const id = Number(req.params.id)
  const product = await contenedor.getById(id)
  console.log(product)
  if(product === undefined){
  return res.status(404).json({error: 'Producto no encontrado'})
  }
  await contenedor.deleteById(id)
  return res.json(product)
})



