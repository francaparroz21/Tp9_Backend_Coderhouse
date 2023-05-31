import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars';
import viewsRouter from './routes/views.router.js';
import {Server} from 'socket.io';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import sessionRouter from './routes/sessions.router.js';

const DB = 'ecommerce';
const MONGO = 'mongodb+srv://merkelgonzalo:dalemillo123@cluster0.a9rnj46.mongodb.net/' + DB;
const PORT = '8080';
const app = express();
const conection = mongoose.connect(MONGO);
const server = app.listen(PORT, ()=>{
    console.log("Server running on port " + PORT);
});
app.use(session({
  store: new MongoStore({
      mongoUrl: MONGO,
      ttl:3600
  }),
  secret:'CoderSecret',
  resave:false,
  saveUninitialized:false
}));

/* const io = new Server(server); */

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/public')); //Important for use js y css files on templates

app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionRouter);

// io.on('connection', socket =>{
//     console.log("New connected client")

//     socket.on('newProduct', async (product) => {
//         await productManager.addProduct(product);
  
//         io.emit('updateProducts', await productManager.getProducts());
//     });

//     socket.on('deleteProduct', async (id) => {
//         await productManager.deleteProductById(id);
  
//         io.emit('updateProducts', await productManager.getProducts());
//     });

//     socket.on("messages", data =>{
//         logs.push({socketid: socket.id, mesage: data})
//         socketServerIO.emit('log', {logs})
//     })

// });