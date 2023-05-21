import { Router } from "express";
import fs from 'fs'
import ProductManager from "../dao/manager/manager_mongo/product.manager.js";
import CartManager from "../dao/manager/manager_mongo/cart.manager.js";

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = Router()

router.get('/', async (req, res) => {
    const products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    res.render('home', {
        products,
        styles: ['/css/home.css']
    })
})

router.get('/realtimeproducts', async (req, res) => {
    const products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    res.render('realTimeProducts', {
        products,
        styles: ['/css/home.css', '/css/realtimeproducts.css']
    })
})

router.get("/products", async (req, res) => {
    try {
      const { limit, page, query, sort } = req.query;
      const { user } = req.session;
      const products = await productManager.get(limit, page, query, sort);
      const docs = []
      products.docs.forEach(element => {
        const {title, description, price} = element
        docs.push({title, description, price})
      });
      res.render("products", {products, docs});
    } catch (error) {
      console.log(error);
    }
  })

  router.get("/carts/:cid", async (req, res) => {
    try {
      const { cid } = req.params
      const products = await cartManager.getCartById(cid).products
      res.render("carts", {products});
    } catch (error) {
      console.log(error);
    }
  })


export default router;