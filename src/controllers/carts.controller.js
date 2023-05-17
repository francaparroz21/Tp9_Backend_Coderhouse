import { Router } from "express";
import fs from "fs"
import CartManager from "../dao/manager/manager_mongo/cart.manager.js"
import { cartModel } from "../dao/models/carts.model.js";

const cartManager = new CartManager()

const router = Router();

//Post - create a cart.
router.post('/', async (req, res) => {
    let carts = JSON.parse(await fs.promises.readFile('./src/files/carts.json', 'utf-8'))
    let generateId = (!carts) ? 0 : carts.length + 1
    let newCart = { id: generateId, products: [] }
    carts.push(newCart)
    await fs.promises.writeFile("./src/files/carts.json", JSON.stringify(carts, null, "\t"))
    res.send({
        status: "OK.",
        cart: newCart
    })
})

//Delete a specific product in some cart.
router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.deleteProductById(cid, pid);
        res.json({ cart });
    } catch (error) {
        res.json({ error });
    }
});

router.put("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const products = req.body;
      await cartManager.insertProducts(cid, products)
      const cart = await cartManager.getCartById(cid)
      res.json({ cart });
    } catch (error) {
      res.json({ error })
    }
  })
  
  router.put("/:cid/product/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      await cartManager.updateQuantity(cid, pid, quantity);
      const cart = await cartManager.getCartById(cid);
      res.json({ cart });
    } catch (error) {
      res.json({ error });
    }
  });

//Get cart by ID.
router.get('/:cid', async (req, res) => {
    let carts = JSON.parse(await fs.promises.readFile('./src/files/carts.json', 'utf-8'))
    let cid = req.params.cid
    let cart = carts.find(cart => cart.id == cid)

    if (!cart) return res.status(404).send({
        status: "Not found.",
        error: `Cart ID ${cid} incorrect, not found.`
    })

    let products = cart.products

    res.send({
        status: "OK.",
        products
    })
})

//Post a product in a specific cart.
router.post('/:cid/product/:pid', async (req, res) => {
    let carts = JSON.parse(await fs.promises.readFile('./src/files/carts.json', 'utf-8'))
    let products = JSON.parse(await fs.promises.readFile('./src/files/products.json', 'utf-8'))
    let cid = req.params.cid
    let pid = req.params.pid
    let cart = carts.find(cart => cart.id == cid)

    if (!cart) return res.status(404).send({
        status: "Not found.",
        error: `Cart ID ${cid} incorrect. not found`
    })

    let indexCart = carts.indexOf(cart)

    let product = products.find(product => product.id == pid)

    if (!product) return res.status(404).send({
        status: "Not found.",
        error: `Product ID ${pid} incorrect. not found`
    })

    let productInCart = cart.products.find(product => product.product == pid.toString())

    if (!productInCart) {
        cart.products.push({ product: pid, quantity: 1 })
        carts.splice(indexCart, 1, cart)
        await fs.promises.writeFile('./src/files/carts.json', JSON.stringify(carts, null, '\t'))
        return res.send({
            status: "OK",
            cart
        })
    }

    let indexProduct = [...cart.products].indexOf(productInCart)
    cart.products.splice(indexProduct, 1, { ...productInCart, quantity: productInCart.quantity + 1 })
    carts.splice(indexCart, 1, cart)

    await fs.promises.writeFile("./src/files/carts.json", JSON.stringify(carts, null, '\t'))
    res.send({
        status: "OK",
        cart
    })
})

router.delete("/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      const cart = await cartManager.deleteById(cid)
      res.json({ cart });
    } catch (error) {
      res.json({ error });
    }
  });

export default router;