//import library yang dibutuhkan
const express = require("express");
const cors = require("cors");
const path = require("path");

// variable port
const PORT = 8080;

//implementasi library
const app = express(); //inisialisasi express
app.use(cors()); //inisialisasi cors
app.use(express.static(path.join(__dirname, "public"))); //inisialisasi static file untuk menyimpan file gambar

// endpoint user
const user = require("./routes/user"); //import file user.js
app.use("/user", user); //implementasi endpoint user

// endpoint meja
const meja = require("./routes/meja"); //import file meja.js
app.use("/meja", meja); //implementasi endpoint meja

// endpoint menu
const menu = require("./routes/menu"); //import file menu.js
app.use("/menu", menu); //implementasi endpoint menu

// endpoint transaksi
const transaksi = require("./routes/transaksi"); //import file transaksi.js
app.use("/transaksi", transaksi); //implementasi endpoint transaksi

// endpoint detail_transaksi
const detail_transaksi = require("./routes/detail_transaksi"); //import file detail_transaksi.js
app.use("/detail_transaksi", detail_transaksi); //implementasi endpoint detail_transaksi

//run server
app.listen(PORT, () => {
  console.log("server run on port " + PORT); //menampilkan pesan di console
});
