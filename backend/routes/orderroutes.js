import express from 'express';
import verifyAuthToken from '../middlewares/verifyAuthToken.js';
import  checkRoleAccess from '../middlewares/checkroleaccess.js';
import * as controller from '../controllers/orderController.js';
import requestLogger from '../middlewares/requestlogger.js';


const router = express.Router();
router.post("/order/prcharges",verifyAuthToken,requestLogger,controller.getShipmentProductCost)
router.post("/orders/charges",verifyAuthToken,requestLogger,controller.getShipmentcost);
router.post("/orders/cart-buy-now",verifyAuthToken,requestLogger,controller.NewCartBuyNow);
router.post("/orders/buy-now",verifyAuthToken,requestLogger,controller.NewProductBuyNow);
router.get("/orders/:orderId/bill",requestLogger,controller.orderBill);
router.get("/admin/getallorders",verifyAuthToken,requestLogger,checkRoleAccess,controller.getAllOrders);
router.post('/orders/confirm-payment',verifyAuthToken,requestLogger,controller.confirmPayment);
router.get("/orders/getorders",verifyAuthToken,requestLogger,checkRoleAccess,controller.getOrdersOfSpecifiUser);
router.get("/orders/:orderId",verifyAuthToken,requestLogger,checkRoleAccess,controller.getOrderById);
router.delete("/orders/delete/:orderId",verifyAuthToken,requestLogger,checkRoleAccess,controller.deleteOrder);
router.put("/orders/update/:orderId",verifyAuthToken,requestLogger,checkRoleAccess,controller.updateOrderStatus);
export default router;