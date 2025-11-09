import express from "express";
import bodyParser from "body-parser";

import adminRoutes from "./routes/admin.js"
import shopRoutes from "./routes/shop.js"

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(adminRoutes)
app.use(shopRoutes)

app.use((req, res) => {
  res.render("404", { pageTitle: "404", path: '/404'  });
});

app.listen(3000);
