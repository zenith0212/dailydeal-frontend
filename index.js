const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();
const dbConnect = require("./db/dbConnect");
const cors = require("cors");
const users = require('./routes/users');
const ourproduct = require('./routes/ourProduct');
const deals = require('./routes/deals');
const wishlist = require('./routes/wishList');
const profile = require('./routes/profile');
const usersreview = require('./routes/usersReview');
const payment = require('./routes/payment');
const orders = require('./routes/orders');
const wholeInfo = require('./routes/wholeInfo');
const address = require('./routes/address');
const visitors = require('./routes/visitors');
const time = require('./routes/time');
const brandgateway = require('./routes/brandgateway');

dbConnect();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use("/api", users);
app.use("/api/ourproduct", ourproduct);
app.use("/api/deals", deals);
app.use("/api/wishlist", wishlist);
app.use("/api/profile", profile);
app.use("/api/review", usersreview);
app.use("/api/pay", payment);
app.use("/api/orders", orders);
app.use("/api/wholeinfo", wholeInfo);
app.use("/api/address", address);
app.use("/api/visitors", visitors);
app.use("/api/time", time);
app.use("/api/brandgateway", brandgateway);

app.get('/',(req, res)=>{
  res.json('working backend');
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
