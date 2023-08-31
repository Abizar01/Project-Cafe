//import library
const express = require("express"); // import library express
const bodyParser = require("body-parser"); // import library body-parser untuk mengambil data dari body request
const auth = require("../auth"); // import fungsi auth

//implementasi library
const app = express(); // inisialisasi express
app.use(bodyParser.json()); // inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true })); // inisialisasi body-parser

//import model
const model = require("../models/index"); // import model
const meja = model.meja; // inisialisasi model meja

// mengambil semua data meja
app.get("/getAllData", auth, async (req, res) => { // endpoint untuk mengambil semua data meja
  await meja
    .findAll() // mengambil semua data meja
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data meja
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

// get data by id meja
app.get("/getById/:id", auth, async (req, res) => { // endpoint untuk mengambil data meja berdasarkan id meja
  await meja
    .findByPk(req.params.id) // mengambil data meja berdasarkan id meja yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) {
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data meja
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

// get meja by status
app.get("/getByStatus/:status", auth, async (req, res) => { // endpoint untuk mengambil data meja berdasarkan status meja
  const param = { status: req.params.status }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  await meja
    .findAll({ where: param }) // mengambil data meja berdasarkan status meja yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data meja
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

// create meja
app.post("/create", async (req, res) => { // endpoint untuk menambahkan data meja
  const data = { // inisialisasi data yang akan dimasukkan
    nomor_meja: req.body.nomor_meja, // mengambil data nomor meja dari body request
    status: "kosong"
  };
  await meja
    .findOne({ where: { nomor_meja: data.nomor_meja } }) // mengambil data meja berdasarkan nomor meja yang dikirimkan
    .then((result) => { // jika berhasil
      if (result) { // jika nomor meja sudah ada
        res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan nomor meja sudah ada
          status: "error",
          message: "nomor meja sudah ada",
        });
      } else { // jika nomor meja belum ada
        meja
          .create(data) // menambahkan data meja
          .then((result) => { // jika berhasil
            res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan meja berhasil ditambahkan
              status: "success",
              message: "meja berhasil ditambahkan",
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

// delete meja
app.delete("/delete/:id_meja", auth, async (req, res) => { // endpoint untuk menghapus data meja
  const param = { id_meja: req.params.id_meja }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  // delete data
  meja
    .destroy({ where: param }) // menghapus data meja berdasarkan id meja yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan meja berhasil dihapus
          status: "success",
          message: "meja berhasil dihapus",
          data: param,
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({  // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
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

// edit meja
app.patch("/edit/:id_meja", auth, async (req, res) => { // endpoint untuk mengubah data meja
  const param = { id_meja: req.params.id_meja }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  const data = { // inisialisasi data yang akan diubah
    nomor_meja: req.body.nomor_meja,
    status: req.body.status,
  };

  meja.findOne({ where: param }).then((result) => { // mengambil data meja berdasarkan id meja yang dikirimkan melalui parameter
    if (result) { // jika data ditemukan
      if (data.nomor_meja != null) { // jika data nomor meja tidak kosong
        meja
          .findOne({ where: { nomor_meja: data.nomor_meja } }) // mengambil data meja berdasarkan nomor meja yang dikirimkan melalui body request
          .then((result) => { // jika berhasil
            if (result) { // jika nomor meja sudah ada
              res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan nomor meja sudah ada
                status: "error",
                message: "nomor meja sudah ada",
              });
            } else { // jika nomor meja belum ada
              meja
                .update(data, { where: param }) // mengubah data meja berdasarkan id meja yang dikirimkan melalui parameter
                .then((result) => { // jika berhasil
                  res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data berhasil diubah
                    status: "success",
                    message: "data berhasil diubah",
                    data: { // mengembalikan data yang telah diubah
                      id_meja: param.id_meja,
                      nomor_meja: data.nomor_meja,
                    },
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
      } else { // jika data nomor meja kosong
        meja
          .update(data, { where: param }) // mengubah data meja berdasarkan id meja yang dikirimkan melalui parameter
          .then((result) => { // jika berhasil
            res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data berhasil diubah
              status: "success",
              message: "data berhasil diubah",
              data: {
                nomor_meja: data.nomor_meja,
              },
            });
          })
          .catch((error) => { // jika gagal
            res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
              status: "error",
              message: error.message,
            });
          });
      }
    } else { // jika data tidak ditemukan
      res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
        status: "error",
        message: "data tidak ditemukan",
      });
    }
  });
});

// search meja
app.get("/search/:nomor_meja", auth, async (req, res) => { // endpoint untuk mencari data meja berdasarkan nomor meja
  meja
    .findOne({ // mengambil data meja berdasarkan nomor meja yang dikirimkan melalui parameter
      where: {
        nomor_meja: req.params.nomor_meja,
      },
    })
    .then((result) => { // jika berhasil
      if(result == null){ // jika data tidak ditemukan
        res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan hasil dari pencarian nomor meja
          status: "success",
          message: "hasil dari pencarian nomor meja " + req.params.nomor_meja,
          data: result,
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