// Include express from node_modules and define server related variables
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// setting mongoose
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", () => {
  console.log("mongodb error!");
});
db.once("open", () => {
  console.log("mongodb connected!");
});

// require express-handlebars here
const exphbs = require("express-handlebars");
const Restaurant = require("./models/restaurant");

// setting template engine
app.engine("hbs", exphbs({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

// setting static files
app.use(express.static("public"));

// setting the route and corresponding response
app.get("/", (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render("index", { restaurants }))
    .catch(error => console.log(error));
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase();

  Restaurant.find()
    .lean()
    .then(restaurants => {
      const filterRestaurant = restaurants.filter(restaurant => {
        return (
          restaurant.name.toLowerCase().includes(keyword) ||
          restaurant.category.includes(keyword)
        );
      });
      res.render("index", { restaurants: filterRestaurant, keyword });
    })
    .catch(error => console.log(error));
});

app.get("/restaurants/:restaurantId", (req, res) => {
  const restaurantId = req.params.restaurantId;
  const restaurant = restaurants.find(
    restaurant => restaurant.id.toString() === restaurantId
  );
  res.render("show", { restaurant: restaurant });
});

// Listen the server when it started
app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`);
});
