const express = require('express');

const {
    getCarts,
    getCartById,
    getCartByUser,
    createCart,
    updateCart,
    deleteCart,
    updateCartItem,
    removeCartItem
} = require('../controllers/cartController');

const router = express.Router();

router.get('/', getCarts);
router.get('/user/:userId', getCartByUser);

router.patch(
    '/user/:userId/item/:productId',
    updateCartItem
);

router.delete(
    '/user/:userId/item/:productId',
    removeCartItem
);

router.get('/:id', getCartById);
router.post('/', createCart);
router.put('/:id', updateCart);
router.delete('/:id', deleteCart);

module.exports = router;
