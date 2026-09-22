import {PLANS} from "../config/plans.js";
import razorpay from "./../config/razorpay.js";
import  crypto  from "crypto";
import Payment from './../models/payment.model.js';
import  axios  from 'axios';

export const createOrder = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    const { plan } = req.body;

    const selectedPlan = PLANS[plan];

    if (!selectedPlan) {
      return res.status(400).json({
        message: "Invalid plan",
      });
    }
    const order = await razorpay.orders.create({
      amount: selectedPlan.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    await Payment.create({
      userId: userId,
      orderId: order?.id,
      amount: selectedPlan?.amount,
      credits: selectedPlan?.credits,
      plan: selectedPlan?.id,
      currency: order?.currency,
      status: "created",
    });

    return res.status(200).json({
      order,
      plan: selectedPlan,
    });
  } catch (error) {
    return res.status(500).json({
      message: `create order error ${error}`,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;
    
    //1. Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");
      

    if (generatedSignature != razorpay_signature) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    //2. Idempotency
    const existingPayment = await Payment.findOne({
      orderId: razorpay_order_id,
    });

    console.log(existingPayment)
    if (!existingPayment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    existingPayment.status = "paid";

    existingPayment.paymentId = razorpay_payment_id;

    await existingPayment.save();

    await axios.patch(
      `${process.env.AUTH_SERVICE}/update-user-plan`,
      {
        userId: existingPayment.userId,
        plan: existingPayment.plan,
        credits: existingPayment.credits,
      },
    );

    return res.status(200).json({
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Payment vefification Failed",
    });
  }
};
