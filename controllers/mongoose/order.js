import { Order } from "../../models/mongoose/order.js";
import PDFDocument from "pdfkit"
import path from "path";
import fs from "fs";

export const postAddOrder = async (req, res, next) => {
    try {
        await req.user.addToOrder();
        res.redirect("/orders");
    } catch (err) {
        console.log("Error: postAddOrder");
        next(err);
    }
};

export const getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user }).populate(
            "products.productId"
        );
        res.render("shop/orders", {
            pageTitle: "Orders",
            path: "/orders",
            orders,
        });
    } catch (err) {
        console.log("Error: getOrders");
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate(
            "products.productId userId"
        );

        const products = order.products.map((prod) => {
            return {
                ...prod.productId._doc,
                quantity: prod.quantity,
            };
        });

        res.render("shop/order-detail", {
            pageTitle: "Order Detail",
            path: "/orders",
            products,
            isAuthenticated: req.session.isLoggedIn,
        });
    } catch (err) {
        console.log("Error: getOrder");
        next(err);
    }
};

export const getInvoice = async (req, res, next) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate(
            "products.productId"
        );

        if (!order) {
            return res.status(404).send("Order not found");
        }
        if (order.userId.toString() != req.user._id.toString()) {
            return res.status(403).send("Unauthorized");
        }

        const invoiceName = "invoice-" + orderId + ".pdf";
        const invoicePath = path.join("data", "invoices", invoiceName);

        // PDF setup
        const pdfDoc = new PDFDocument({ margin: 40 });

        // Also save a copy
        pdfDoc.pipe(fs.createWriteStream(invoicePath));

        // Stream PDF to browser
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${invoiceName}"`
        );
        pdfDoc.pipe(res);

        // ───────────────────────────────
        // HEADER
        // ───────────────────────────────
        pdfDoc.fontSize(24).text("INVOICE", { align: "center" });
        pdfDoc.moveDown();

        pdfDoc.fontSize(12).text(`Order ID: ${orderId}`);
        pdfDoc.text(`Date: ${new Date().toLocaleString()}`);
        pdfDoc.text(`Customer: ${req.user.email}`);
        pdfDoc.moveDown(2);

        // ───────────────────────────────
        // PRODUCTS TABLE
        // ───────────────────────────────

        pdfDoc.fontSize(14).text("Order Items:");
        pdfDoc.moveDown(1);

        const products = order.products; // each -> { product, quantity }

        if (products.length === 0) {
            pdfDoc.text("No products in this order.");
        } else {
            // Table header
            pdfDoc
                .fontSize(12)
                .text("TITLE", 40, pdfDoc.y, { width: 150 })
                .text("PRICE", 200, pdfDoc.y, { width: 80 })
                .text("QTY", 280, pdfDoc.y, { width: 60 })
                .text("DESCRIPTION", 340, pdfDoc.y);

            pdfDoc.moveDown(0.5);

            pdfDoc.moveTo(40, pdfDoc.y).lineTo(550, pdfDoc.y).stroke();

            // Table rows
            let total = 0;

            products.forEach((item) => {
                const p = item.productId;
                const qty = item.quantity;
                total += p.price * qty;

                pdfDoc
                    .fontSize(12)
                    .text(p.title, 40, pdfDoc.y + 5, { width: 150 })
                    .text(`$${p.price}`, 200, pdfDoc.y, { width: 80 })
                    .text(qty.toString(), 280, pdfDoc.y, { width: 60 })
                    .text(p.description || "-", 340, pdfDoc.y);

                pdfDoc.moveDown(1);
            });

            // Separator line
            pdfDoc.moveDown(0.5);
            pdfDoc.moveTo(40, pdfDoc.y).lineTo(550, pdfDoc.y).stroke();

            // TOTAL
            pdfDoc.moveDown(1);
            pdfDoc
                .fontSize(14)
                .text(`Total: $${total.toFixed(2)}`, { align: "right" });
        }

        // ───────────────────────────────
        // FOOTER
        // ───────────────────────────────
        pdfDoc.moveDown(4);
        pdfDoc.fontSize(10).text("Thank you for your purchase!", {
            align: "center",
            opacity: 0.7,
        });

        pdfDoc.end();
    } catch (err) {
        next(err);
    }
};
