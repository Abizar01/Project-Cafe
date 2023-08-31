//import library
const express = require("express"); // import library express
const bodyParser = require("body-parser"); // import library body-parser untuk mengambil data dari body request
const auth = require("../auth"); // import fungsi auth
const { Op } = require("sequelize"); // import operator sequelize
const multer = require("multer"); // import library multer untuk upload file
const path = require("path"); // import library path untuk mengambil ekstensi file
const fs = require("fs"); // import library fs untuk menghapus file

//implementasi library
const app = express(); // inisialisasi express
app.use(bodyParser.json()); // inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true })); // inisialisasi body-parser

//import model
const model = require("../models/index"); // import model
const menu = model.menu; // inisialisasi model meja

//config storage image
const storage = multer.diskStorage({ // inisialisasi konfigurasi penyimpanan file
  destination: (req, file, cb) => { // konfigurasi folder penyimpanan file
    cb(null, "./public/image"); // folder penyimpanan file
  },
  filename: (req, file, cb) => { // konfigurasi nama file
    cb(null, "img-" + Date.now() + path.extname(file.originalname)); // nama file
  },
});
let upload = multer({ storage: storage }); // inisialisasi konfigurasi penyimpanan file

// mengambil semua data menu
app.get("/getAllData", auth, async (req, res) => { // endpoint untuk mengambil semua data menu
  await menu
    .findAll() // mengambil semua data menu
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data menu
        status: "success",
        data: result,
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// get data by id menu
app.get("/getById/:id", auth, async (req, res) => { // endpoint untuk mengambil data menu berdasarkan id menu
  await menu
    .findByPk(req.params.id) // mengambil data menu berdasarkan id menu yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) {
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data menu
          status: "success",
          data: result,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// create menu
app.post("/create", upload.single("gambar"), auth, async (req, res) => { // endpoint untuk menambahkan data menu
  const data = { // inisialisasi data yang akan dikirimkan melalui body request
    nama_menu: req.body.nama_menu,
    jenis: req.body.jenis,
    deskripsi: req.body.deskripsi,
    gambar: req.file.filename,
    harga: req.body.harga,
  };
  await menu
    .findOne({ where: { nama_menu: data.nama_menu } }) // mengambil data menu berdasarkan nama menu yang dikirimkan
    .then((result) => { // jika berhasil
      if (result) { // jika nama menu sudah ada
        res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan nama menu sudah ada
          status: "error",
          message: "nama menu sudah ada",
        });
      } else { // jika nama menu belum ada
        menu
          .create(data) // menambahkan data menu
          .then((result) => { // jika berhasil
            res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan menu berhasil ditambahkan
              status: "success",
              message: "menu berhasil ditambahkan",
              data: result,
            });
          })
          .catch((error) => { // jika gagal
            res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
              status: "error",
              message: error.message,
            });
          });
      }
    });
});

// delete menu
app.delete("/delete/:id_menu", auth, async (req, res) => { // endpoint untuk menghapus data menu
  const param = { id_menu: req.params.id_menu }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  menu
    .destroy({ where: param }) // menghapus data menu berdasarkan id menu yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan menu berhasil dihapus
          status: "success",
          message: "menu berhasil dihapus",
          data: param,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// edit menu
app.patch("/edit/:id_menu", upload.single("gambar"), auth, async (req, res) => { // endpoint untuk mengubah data menu
  const param = { id_menu: req.params.id_menu }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  const data = { // inisialisasi data yang akan diubah
    nama_menu: req.body.nama_menu,
    jenis: req.body.jenis,
    deskripsi: req.body.deskripsi,
    harga: req.body.harga,
    resultArr: {},
  };

  menu.findOne({ where: param }).then((result) => { // mengambil data menu berdasarkan id menu yang dikirimkan melalui parameter
    if (result) { // jika data ditemukan
      if (req.file) { // jika data gambar tidak kosong
        let oldFileName = result.gambar; // mengambil nama file lama
        let dir = path.join(__dirname, "../public/image/", oldFileName); // mengambil lokasi file lama
        fs.unlink(dir, (err) => err); // menghapus file lama
        data.gambar = req.file.filename; // mengubah nama file gambar
      }
      menu
        .update(data, { where: param }) // mengubah data menu berdasarkan id menu yang dikirimkan melalui parameter
        .then((result) => { // jika berhasil
          res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data berhasil diubah
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_menu: param.id_menu,
              nama_menu: data.nama_menu,
              harga: data.harga,
              deskripsi: data.deskripsi,
              gambar: data.gambar,
              jenis: data.jenis,
            },
          });
        })
        .catch((error) => { // jika gagal
          res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
            status: "error",
            message: error.message,
          });
        });
    } else { // jika data tidak ditemukan
      res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
        status: "error",
        message: "data tidak ditemukan",
      });
    }
  });
});

// mencari menu
app.get("/search/:nama_menu", auth, async (req, res) => { // endpoint untuk mencari data menu berdasarkan nama menu
  menu 
    .findAll({ // query untuk mencari data menu berdasarkan nama menu
      where: { 
        [Op.or]: [ // query untuk mencari data menu berdasarkan nama menu
          { nama_menu: { [Op.like]: "%" + req.params.nama_menu + "%" } },
        ],
      },
    })
    .then((result) => { // jika berhasil
      if (result.length > 0) { // jika data menu ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data menu
          status: "success",
          message: "menu berhasil ditemukan",
          data: result,
        });
      } else { // jika data menu tidak ditemukan
        res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
          status: "error",
          message: "menu not found",
        });
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

module.exports = app; // export module app
