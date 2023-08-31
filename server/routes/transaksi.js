//import library
const express = require("express"); // import library express
const bodyParser = require("body-parser"); // import library body-parser untuk mengambil data dari body request
const auth = require("../auth"); // import fungsi auth
const { Op } = require("sequelize"); // import operator sequelize

//implementasi library
const app = express(); // inisialisasi express
app.use(bodyParser.json()); // inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true })); // inisialisasi body-parser

//import model
const model = require("../models/index"); // import model
const transaksi = model.transaksi; // inisialisasi model transaksi
const user = model.user; // inisialisasi model user
const meja = model.meja; // inisialisasi model meja

// mengambil semua data transaksi
app.get("/getAllData", auth, async (req, res) => { // endpoint untuk mengambil semua data transaksi
  await transaksi
    .findAll({
      include: [ // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ]
    }) // mengambil semua data transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data transaksi
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

// get data by id transaksi
app.get("/getById/:id", auth, async (req, res) => { // endpoint untuk mengambil data transaksi berdasarkan id transaksi
  await transaksi
    .findByPk(req.params.id, {
      include: [ // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ]
    }) // mengambil data transaksi berdasarkan id transaksi yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) {
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data transaksi
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

// get transaksi by id user
app.get("/getByIdUser/:id_user", auth, async (req, res) => { // endpoint untuk mengambil data transaksi berdasarkan id user
  await transaksi
  .findAll({
    where: { id_user: req.params.id_user },
    include: [ // join tabel user dan meja
      {
        model: user,
        as: "user",
      },
      {
        model: model.meja,
        as: "meja",
      },
    ]
  , }) // mengambil data transaksi berdasarkan id user yang dikirimkan melalui parameter
  .then((result) => { // jika berhasil
    if (result) {
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data transaksi
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

// create transaksi
app.post("/create", async (req, res) => { // endpoint untuk menambahkan data transaksi
  const data = { // inisialisasi data yang akan dimasukkan
    id_user: req.body.id_user,
    id_meja: req.body.id_meja,
    nama_pelanggan: req.body.nama_pelanggan,
    status: req.body.status,
  };

  await transaksi
    .create(data) // menambahkan data transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan transaksi berhasil ditambahkan
        status: "success",
        message: "transaksi berhasil ditambahkan",
        data: result,
      });

      // update status meja
      meja.update({ status: "terisi" }, { where: { id_meja: req.body.id_meja } }); // mengubah status meja menjadi dipesan
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// delete transaksi
app.delete("/delete/:id_transaksi", auth, async (req, res) => { // endpoint untuk menghapus data transaksi
  const param = { id_transaksi: req.params.id_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  transaksi
    .destroy({ where: param }) // menghapus data transaksi berdasarkan id transaksi yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan transaksi berhasil dihapus
          status: "success",
          message: "transaksi berhasil dihapus",
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

// edit transaksi
app.patch("/edit/:id_transaksi", auth, async (req, res) => { // endpoint untuk mengubah data transaksi
  const param = { id_transaksi: req.params.id_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  const data = { // inisialisasi data yang akan diubah
    id_user: req.body.id_user,
    id_meja: req.body.id_meja,
    nama_pelanggan: req.body.nama_pelanggan,
    status: req.body.status,
  };

  transaksi.findOne({ where: param }).then((result) => { // mengambil data transaksi berdasarkan id transaksi yang dikirimkan melalui parameter
    if (result) { // jika data ditemukan
      transaksi
        .update(data, { where: param }) // mengubah data transaksi berdasarkan id transaksi yang dikirimkan melalui parameter
        .then((result) => { // jika berhasil
          res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data berhasil diubah
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_transaksi: param.id_transaksi,
              ...data,
            },
          });

          // update status meja
          if (req.body.status === "lunas") {
            meja.update({ status: "kosong" }, { where: { id_meja: req.body.id_meja } }); // mengubah status meja menjadi kosong
          }
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

// filtering transaksi berdasarkan tgl_transaksi
app.get("/filter/tgl_transaksi/:tgl_transaksi", auth, async (req, res) => { // endpoint untuk mencari data transaksi berdasarkan tanggal transaksi
  const param = { tgl_transaksi: req.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  transaksi
   .findAll({ // mengambil data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
      where: {
        tgl_transaksi: {
          [Op.between]: [
            param.tgl_transaksi + " 00:00:00",
            param.tgl_transaksi + " 23:59:59",
          ], // mencari data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
        }
      },
      include: [ // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => { // jika berhasil
      if (result.length === 0) { // jika data tidak ditemukan
        res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data ditemukan
          status: "success",
          message: "data ditemukan",
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

// filtering transaksi berdasarkan nama_user dari tabel user
app.get("/filter/nama_user/:nama_user", auth, async (req, res) => { // endpoint untuk mencari data transaksi berdasarkan nama user
  const param = { nama_user: req.params.nama_user }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  user
    .findAll({ // mengambil data user berdasarkan nama user yang dikirimkan melalui parameter
      where: {
        nama_user: param.nama_user,
      },
    })
    .then((result) => { // jika berhasil
      if (result == null) { // jika data tidak ditemukan
        res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else { // jika data ditemukan
        transaksi
          .findAll({ // mengambil data transaksi berdasarkan id user yang dikirimkan melalui parameter
            where: {
              id_user: result[0].id_user,
            },
          })
          .then((result) => { // jika berhasil
           if (result.length === 0) { // jika data tidak ditemukan
              res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
                status: "error",
                message: "data tidak ditemukan",
              });
            } else { // jika data ditemukan
              res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data ditemukan
                status: "success",
                message: "data ditemukan",
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
      }
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// filtering transaksi berdasarkan bulan transaksi dari tgl_transaksi
app.get("/filter/bulan_transaksi/:bulan_transaksi", auth, async (req, res) => {
  const params = { bulan_transaksi: req.params.bulan_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  transaksi
    .findAll({ // mengambil data transaksi berdasarkan bulan transaksi yang dikirimkan melalui parameter
      where: {
        tgl_transaksi: {
          // mengambil 2 digit pertama dari bulan transaksi yang dikirimkan melalui parameter
          [Op.like]: params.bulan_transaksi + "%",
        }
      },
      include: [ // join tabel user dan meja
        {
          model: user,
          as: "user",
        },
        {
          model: model.meja,
          as: "meja",
        },
      ],
    })
    .then((result) => { // jika berhasil
      if (result.length === 0) { // jika data tidak ditemukan
        res.status(404).json({ // mengembalikan response dengan status code 404 dan pesan data tidak ditemukan
          status: "error",
          message: "data tidak ditemukan",
        });
      } else { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data ditemukan
          status: "success",
          message: "data ditemukan",
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
})


module.exports = app; // export module app