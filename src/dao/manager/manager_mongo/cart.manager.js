import { cartModel } from "../../models/carts.model.js"
import { productModel } from "../../models/products.model.js"
import ProductManager from "./product.manager.js"

const productManager = new ProductManager()

class CartManager{
    async getCarts(){
        try{
            const cartModel = await cartModel.find()
            
            if(!cartModel.length) return { status: 404, response: "Carts not found."}

            const carts = response.map(cart => ({ id: cart._id, products: cart.products }))

            return { status: 200, response: carts }
        }catch(error){
            console.log(`error: ${error}`)
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
          let number = Number(quantity);
          const cart = await cartModel.findById(cid);
          const index = cart.products
            .map((elem) => elem.product._id.toString())
            .indexOf(pid);
          cart.products[index].quantity = number;
          const response = await cartModel.updateOne({ _id: cid }, cart);
          return response;
        } catch (error) {
          console.log(error);
        }
      }

    async getCartById(id){
        try{
            const cartFound = await cartModel.find({ _id: id })
            
            if(!cartFound) return { status: 404, response: "Cart not found" }

            return { status: 200, ok: true, response: mapped }
        }catch(error){
            console.log(`error: ${error}`)
        }
    }

    async createCart(){
        try{
            await cartModel.create({ products: []})
        
            return { status: 200, response: "Cart created." }
        }catch(error){
            console.log(`error: ${error}`)
        } 
    }

    async addProductToCart(cartId, productId){
        try{
            const cartFound = await cartModel.find({ _id: cartId})

            if(!cartFound) return { status: 404, response: "Cart not found." }

            const productFound = await productModel.find({ _id: productId })
            
            if(!productFound )return { status: 404, response: "Product not found." }
            
            const cartProducts = cartFound[0].products

            const productRepeated = cartProducts.find(cart => cart.id === productId)
            let updatedProducts

            if(!productRepeated) updatedProducts = [...cartProducts, { id: productId, quantity: 1}]
            if(productRepeated) updatedProducts = cartProducts.map(product => product.id === productId ? {...product, quantity: product.quantity + 1} : product)

            const updatedCart = {...cartFound, products: updatedProducts}

            await cartModel.updateOne({ _id: cartId}, updatedCart)

            return { status: 200, response: "Product added to cart." }
        }catch(error){
            console.log(`error: ${error}`)
        }
    }

    async deleteProductById(cid, pid) {
        try {
          const product = await productManager.getProductById(pid)
          if (!product) return `Product not Found`;
          const cart = await cartModel.findById(cid)
          if (!cart) return `Cart not found`;
    
          const productIndex = cart.products
            .map((elem) => elem.product._id.toString())
            .indexOf(pid);
    
          cart.products.splice(productIndex, 1);
    
          await cartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });
          const cartUpdated = await cartModel.findById(cid);
          return cartUpdated;
        } catch (error) {
          console.log(error);
        }
      }

      async deleteById(cid) {
        try {
          const cart = await cartModel.findOne({ _id: cid });
          if (!cart) return `Cart not found.`;
          cart.products = [];
          await cartModel.updateOne({ _id: cid }, cart);
          const updatedCart = await cartModel.findById(cid);
          return updatedCart;
        } catch (error) {
          console.log(error);
        }
      }

      async addProducts(cid, products) {
        try {
          const cart = await cartModel.findOne({ _id: cid });
          cart.products = products;
          const response = await cartModel.updateOne({ _id: cid }, cart);
          return response;
        } catch (error) { 
          console.log(error);
        }
      }
    

    async deleteCart(id){
        try{
            const cartFound = await cartModel.find({ _id: id })

            if(!cartFound) return { status: 404, response: "Cart not found." }

            await cartModel.deleteOne({ _id: id })

            return { status: 200, response: "Cart deleted." }
        }catch(error){
            console.log(`error: ${error}`)
        }
    }
}

export default CartManager