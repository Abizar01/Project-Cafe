//import library
const express = require("express"); // import library express
const bodyParser = require("body-parser"); // import library body-parser untuk mengambil data dari body request
const auth = require("../auth"); // import fungsi auth
const { Op, fn, col, literal } = require("sequelize"); // import operator sequelize

//implementasi library
const app = express(); // inisialisasi express
app.use(bodyParser.json()); // inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true })); // inisialisasi body-parser

//import model
const model = require("../models/index"); // import model
const detail_transaksi = model.detail_transaksi; // inisialisasi model detail_transaksi

// mengambil semua data detail_transaksi
app.get("/getAllData", auth, async (req, res) => { // endpoint untuk mengambil semua data detail_transaksi
  await detail_transaksi
    .findAll() // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
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

// get data by id detail_transaksi
app.get("/getById/:id", auth, async (req, res) => { // endpoint untuk mengambil data detail_transaksi berdasarkan id detail_transaksi
  await detail_transaksi
    .findByPk(req.params.id) // mengambil data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) {
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
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

// get data by id_transaksi
app.get("/getByIdTransaksi/:id_transaksi", auth, async (req, res) => { // endpoint untuk mengambil semua data detail_transaksi berdasarkan id_transaksi
  await detail_transaksi
    .findAll({
      where: { id_transaksi: req.params.id_transaksi }, // mengambil semua data detail_transaksi berdasarkan id_transaksi yang dikirimkan melalui parameter
      include: [
        {
          model: model.menu,
          as: "menu",
        },
      ],
    }) // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
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

// create detail_transaksi
app.post("/create", async (req, res) => { // endpoint untuk menambahkan data detail_transaksi
  const data = { // inisialisasi data yang akan dimasukkan
    id_transaksi: req.body.id_transaksi,
    id_menu: req.body.id_menu,
    harga: req.body.harga,
    jumlah: req.body.jumlah,
  };

  await detail_transaksi
    .create(data) // menambahkan data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan detail_transaksi berhasil ditambahkan
        status: "success",
        message: "detail transaksi berhasil ditambahkan",
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

// delete detail_transaksi
app.delete("/delete/:id_detail_transaksi", auth, async (req, res) => { // endpoint untuk menghapus data detail_transaksi
  const param = { id_detail_transaksi: req.params.id_detail_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter

  detail_transaksi
    .destroy({ where: param }) // menghapus data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan detail_transaksi berhasil dihapus
          status: "success",
          message: "detail transaksi berhasil dihapus",
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

// edit detail_transaksi
app.patch("/edit/:id_detail_transaksi", auth, async (req, res) => { // endpoint untuk mengubah data detail_transaksi
  const param = { id_detail_transaksi: req.params.id_detail_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  const data = { // inisialisasi data yang akan diubah
   id_transaksi: req.body.id_transaksi,
   id_menu: req.body.id_menu,
   harga: req.body.harga,
   jumlah: req.body.jumlah,
  };

  detail_transaksi.findOne({ where: param }).then((result) => { // mengambil data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
    if (result) { // jika data ditemukan
      detail_transaksi
        .update(data, { where: param }) // mengubah data detail_transaksi berdasarkan id detail_transaksi yang dikirimkan melalui parameter
        .then((result) => { // jika berhasil
          res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan data berhasil diubah
            status: "success",
            message: "data berhasil diubah",
            data: {
              id_detail_transaksi: param.id_detail_transaksi,
              ...data,
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

// mencari menu yang paling banyak di pesan dan yang paling sedikit di pesan
app.get("/getMenu", auth, async (req, res) => { // endpoint untuk mengambil semua data detail_transaksi berdasarkan id_transaksi
  await detail_transaksi
    .findAll({
      attributes: [
        'id_menu',
        [fn('SUM', col('detail_transaksi.jumlah')), 'jumlah']
      ],
      include: [
        {
          model: model.menu,
          as: 'menu'
        }
      ],
      group: ['id_menu'],
      order: [[literal('jumlah'), 'DESC']]
    }) // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
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

// mencari total pendapatan berdasarkan tanggal
app.get("/getPendapatan/:tgl_transaksi", auth, async (req, res) => { // endpoint untuk mengambil semua data detail_transaksi berdasarkan id_transaksi
  const param = { tgl_transaksi: req.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  await detail_transaksi
    .findAll({
      // attributes diisi dengan nama kolom yang akan diambil datanya
      // attributes berfungsi untuk mengambil data dari tabel yang diinginkan
      attributes: [
        [fn('SUM', col('detail_transaksi.harga')), 'pendapatan']
      ],
      // include berfungsi untuk mengambil data dari tabel lain yang terhubung dengan tabel yang diinginkan
      include: [
        {
          model: model.transaksi,
          as: 'transaksi',
          where: {
            tgl_transaksi: {
              [Op.between]: [
                param.tgl_transaksi + " 00:00:00",
                param.tgl_transaksi + " 23:59:59",
              ], // mencari data transaksi berdasarkan tanggal transaksi yang dikirimkan melalui parameter
            }
          },
        }
      ],
      group: ['detail_transaksi.id_transaksi']
    }) // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
        status: "success",
        data: result,
        total_keseluruhan: result.reduce((a, b) => a + parseInt(b.dataValues.pendapatan), 0) // menghitung total keseluruhan pendapatan
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// mencari total pendapatan berdasarkan bulan
app.get("/getPendapatanBulan/:tgl_transaksi", auth, async (req, res) => { // endpoint untuk mengambil semua data detail_transaksi berdasarkan id_transaksi
  const param = { tgl_transaksi: req.params.tgl_transaksi }; // inisialisasi parameter yang akan dikirimkan melalui parameter
  await detail_transaksi
    .findAll({
      // attributes diisi dengan nama kolom yang akan diambil datanya
      // attributes berfungsi untuk mengambil data dari tabel yang diinginkan
      attributes: [
        [fn('SUM', col('detail_transaksi.harga')), 'pendapatan']
      ],
      // include berfungsi untuk mengambil data dari tabel lain yang terhubung dengan tabel yang diinginkan
      include: [
        {
          model: model.transaksi,
          as: 'transaksi',
          where: literal(`MONTH(tgl_transaksi) = ${param.tgl_transaksi}`)
        }
      ],
      group: ['detail_transaksi.id_transaksi']
    }) // mengambil semua data detail_transaksi
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data detail_transaksi
        status: "success",
        data: result,
        total_keseluruhan: result.reduce((a, b) => a + parseInt(b.dataValues.pendapatan), 0) // menghitung total keseluruhan pendapatan
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

module.exports = app; // export module app