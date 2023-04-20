// Include express from node_modules and define server related variables
const express = require("express");
const app = express();
const port = 3000;

// require express-handlebars here
const exphbs = require("express-handlebars");
const restaurants = require("./restaurant.json").results;

// setting template engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// setting static files
app.use(express.static("public"));

// setting the route and corresponding response
app.get("/", (req, res) => {
  res.render("index", { restaurants: restaurants });
});

app.get("/search", (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase();

  // 將資料保留 id name category image
  const filterRestaurant = restaurants.map(item => {
    return {
      id: item.id,
      name: item.name.toLowerCase(),
      category: item.category,
      image: item.image,
      rating: item.rating,
    };
  });

  const searchRestaurant = filterRestaurant.filter(restaurant => {
    return (
      restaurant.name.includes(keyword) || restaurant.category.includes(keyword)
    );
  });

  res.render("index", { restaurants: searchRestaurant, keyword: keyword });
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
