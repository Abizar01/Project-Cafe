//import library
const express = require("express"); // import library express
const bodyParser = require("body-parser"); // import library body-parser untuk mengambil data dari body request
const bcrypt = require("bcrypt"); // import library bcrypt untuk enkripsi password
const { Op } = require("sequelize"); // import library sequelize untuk query
const auth = require("../auth"); // import fungsi auth
const jwt = require("jsonwebtoken"); //import library jwt
const SECRET_KEY = "UKK_Cafe_Kasir"; //inisialisasi secret key untuk jwt

//implementasi library
const app = express(); // inisialisasi express
app.use(bodyParser.json()); // inisialisasi body-parser
app.use(bodyParser.urlencoded({ extended: true })); // inisialisasi body-parser

//import model
const model = require("../models/index"); // import model
const user = model.user; // inisialisasi model user

// get all data user
app.get("/getAllData", auth, async (req, res) => { // endpoint untuk mengambil semua data user
  await user
    .findAll() // mengambil semua data user
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data user
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

// get data by id user
app.get("/getById/:id", auth, async (req, res) => { // endpoint untuk mengambil data user berdasarkan id user
  await user
    .findByPk(req.params.id) // mengambil data user berdasarkan id user yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data user
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

// get data by role
app.get("/getByRole/:role", auth, async (req, res) => { // endpoint untuk mengambil data user berdasarkan role
  await user
    .findAll({ where: { role: req.params.role } }) // mengambil data user berdasarkan role yang dikirimkan melalui parameter
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data user
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

// register
app.post("/register", async (req, res) => { // endpoint untuk registrasi user
  const data = { // inisialisasi data user yang akan disimpan ke database dengan data yang dikirimkan melalui body request
    nama_user: req.body.nama_user,
    role: req.body.role,
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 10),
    resultArr: {},
  };
  await user
    .findAll({ // mengambil semua data user
      where: { // query untuk mencari data user berdasarkan nama_user
        [Op.or]: [{ username: data.username }],
      },
    })
    .then((result) => { // jika berhasil
      resultArr = result; // menyimpan data user yang ditemukan ke dalam variabel resultArr
      if (resultArr.length > 0) { // jika data user ditemukan
        res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
          status: "error",
          message: "username sudah terdaftar",
        });
      } else { // jika data user tidak ditemukan
        user
          .create(data) // menyimpan data user ke database
          .then((result) => { // jika berhasil
            res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan sukses
              status: "success",
              message: "user has been registered",
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

// login
app.post("/login", async (req, res) => { // endpoint untuk login user
  const data = await user.findOne({ where: { username: req.body.username } }); // mengambil data user berdasarkan username yang dikirimkan melalui body request

  if (data) { // jika data user ditemukan
    const validPassword = await bcrypt.compare( // membandingkan password yang dikirimkan melalui body request dengan password yang ada di database
      req.body.password,
      data.password
    );
    if (validPassword) { // jika password valid
      let payload = JSON.stringify(data); // generate payload
      // generate token
      let token = jwt.sign(payload, SECRET_KEY); // generate token dengan payload dan secret key
      res.status(200).json({ // mengembalikan response dengan status code 200 dan data user
        status: "success",
        logged: true,
        message: "password benar",
        token: token,
        data: data,
      });
    } else {
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: "password salah",
      });
    }
  } else {
    res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
      status: "error",
      message: "user tidak ditemukan",
    });
  }
});

// delete user
app.delete("/delete/:id_user", auth, async (req, res) => { // endpoint untuk menghapus data user berdasarkan id user
  const param = { id_user: req.params.id_user }; // inisialisasi parameter untuk query delete data
  // delete data
  user
    .destroy({ where: param }) // query untuk menghapus data user berdasarkan id user
    .then((result) => { // jika berhasil
      res.json({ // mengembalikan response dengan status code 200 dan pesan sukses
        status: "success",
        message: "user has been deleted",
        data: param,
      });
    })
    .catch((error) => { // jika gagal
      res.json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// edit user
app.patch("/edit/:id_user", auth, async (req, res) => { // endpoint untuk mengubah data user berdasarkan id user
  const param = { id_user: req.params.id_user }; // inisialisasi parameter untuk query update data
  const data = { // inisialisasi data user yang akan diubah dengan data yang dikirimkan melalui body request
   nama_user: req.body.nama_user,
   role: req.body.role,
   username: req.body.username,
   password: req.body.password,
   resultArr: {},
 };

  // cek password
  if (data.password) { // jika password dikirimkan melalui body request
    const salt = await bcrypt.genSalt(10); // generate salt
    data.password = await bcrypt.hash(data.password, salt); // generate password hash
  }

  if (data.username) { // jika username dikirimkan melalui body request
    user
      .findAll({ // mengambil semua data user
        where: { // query untuk mencari data user berdasarkan username
          [Op.or]: [{ username: data.username }], // query untuk mencari data user berdasarkan username
        },
      })
      .then((result) => { // jika berhasil
        resultArr = result; // menyimpan data user yang ditemukan ke dalam variabel resultArr
        if (resultArr.length > 0) { // jika data user ditemukan
          res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
            status: "error",
            message: "username sudah terdaftar",
          });
        }
      });
  }
  user
    .update(data, { where: param }) // query untuk mengubah data user berdasarkan id user
    .then((result) => { // jika berhasil
      res.status(200).json({ // mengembalikan response dengan status code 200 dan pesan sukses
        status: "success",
        message: "user has been updated",
        data: { // data user yang telah diubah
          id_user: param.id_user,
          nama_user: data.nama_user,
          username: data.username,
          role: data.role,
        },
      });
    })
    .catch((error) => { // jika gagal
      res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
        status: "error",
        message: error.message,
      });
    });
});

// search user
app.get("/search/:nama_user", auth, async (req, res) => { // endpoint untuk mencari data user berdasarkan nama user
  user 
    .findAll({ // query untuk mencari data user berdasarkan nama user
      where: { 
        [Op.or]: [ // query untuk mencari data user berdasarkan nama user
          { nama_user: { [Op.like]: "%" + req.params.nama_user + "%" } },
        ],
      },
    })
    .then((result) => { // jika berhasil
      if (result.length > 0) { // jika data user ditemukan
        res.status(200).json({ // mengembalikan response dengan status code 200 dan data user
          status: "success",
          message: "user berhasil ditemukan",
          data: result,
        });
      } else { // jika data user tidak ditemukan
        res.status(400).json({ // mengembalikan response dengan status code 400 dan pesan error
          status: "error",
          message: "user not found",
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
