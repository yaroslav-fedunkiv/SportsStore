module.exports = function () {
  return {
    products: [
      { id: 1, name: "Kayak", category: "Watersports",
        description: "A boat for one person", price: 275 },
      { id: 2, name: "Lifejacket", category: "Watersports",
        description: "Protective and fashionable", price: 48.95 },
      { id: 3, name: "Soccer Ball", category: "Soccer",
        description: "FIFA-approved size and weight", price: 19.50 },
      { id: 4, name: "Corner Flags", category: "Soccer",
        description: "Give your playing field a professional touch",
        price: 34.95 },
      { id: 5, name: "Stadium", category: "Soccer",
        description: "Flat-packed 35,000-seat stadium", price: 79500 },
      { id: 6, name: "Thinking Cap", category: "Chess",
        description: "Improve brain efficiency by 75%", price: 16 },
      { id: 7, name: "Unsteady Chair", category: "Chess",
        description: "Secretly give your opponent a disadvantage",
        price: 29.95 },
      { id: 8, name: "Human Chess Board", category: "Chess",
        description: "A fun game for the family", price: 75 },
      { id: 9, name: "Bling King", category: "Chess",
        description: "Gold-plated, diamond-studded King", price: 1200 }
    ],
    orders: []
  }
}
const jwt = require("jsonwebtoken");
const APP_SECRET = "myappsecret";
const USERNAME = "admin";
const PASSWORD = "secret";
const mappings = {
  get: ["/api/orders", "/orders"],
  post: ["/api/products", "/products", "/api/categories", "/categories"]
}
function requiresAuth(method, url) {
  return (mappings[method.toLowerCase()] || [])
    .find(p => url.startsWith(p)) !== undefined;
}
module.exports = function (req, res, next) {
  if (req.url.endsWith("/login") && req.method == "POST") {
    if (req.body && req.body.name == USERNAME && req.body.password == PASSWORD) {
      let token = jwt.sign({ data: USERNAME, expiresIn: "1h" }, APP_SECRET);
      res.json({ success: true, token: token });
    } else {
      res.json({ success: false });
    }
    res.end();
    return;
  } else if (requiresAuth(req.method, req.url)) {
    let token = req.headers["authorization"] || "";
    if (token.startsWith("Bearer<")) {
      token = token.substring(7, token.length - 1);
      try {
        jwt.verify(token, APP_SECRET);
        next();
        return;
      } catch (err) { }
    }
    res.statusCode = 401;
    res.end();
    return;
  }
  next();
}
