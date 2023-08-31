// Desc: Halaman Detail Transaksi
// import library yang dibutuhkan
import React, { useEffect, useState } from "react";
import {
  Text,
  Input,
  Flex,
  Grid,
  GridItem,
  Select,
  Center,
  Box,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Heading from "../../../components/text/Heading";
import {
  getTransaksiById,
  getDetailTransaksiByIdTransaksi,
} from "./fragments/ApiHandler";

// buat komponen index
export default function index() {
  // deklarasi variabel
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, reset } = useForm();
  const [transaksi, setTransaksi] = useState([]);
  const [kolomMenu, setKolomMenu] = useState([]);

  // fungsi untuk mengambil data transaksi berdasarkan id
  const getTransaksi = async () => {
    const res = await getTransaksiById(id);
    const resDetailTransaksi = await getDetailTransaksiByIdTransaksi(id);
    setTransaksi(res.data);
    setKolomMenu(resDetailTransaksi.data);
  };

  // fungsi untuk memasukan data ke dalam form
  useEffect(() => {
    if (transaksi) {
      const tgl_transaksi = new Date(
        transaksi?.tgl_transaksi
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }); // mengubah format tanggal menjadi tanggal lokal indonesia
      reset({
        tgl_transaksi: tgl_transaksi,
        id_meja: transaksi?.meja?.nomor_meja,
        nama_pelanggan: transaksi?.nama_pelanggan,
        status: transaksi?.status,
        status_meja: transaksi?.meja?.status,
      });
    }
  }, [transaksi]);

  // ambil data menu ketika komponen pertama kali di render
  useEffect(() => {
    getTransaksi();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      window.print();
      navigate(`/dashboard/kasir/transaksi/${id}`);
    }, 1500);
  }, [kolomMenu]);

  return (
    <Center minH={"100vh"} w={"full"} maxW={"100vw"}>
      <Box
        minH={"80vh"}
        w={{ base: "90%", md: "90%", xl: "80%" }}
        rounded={"2xl"}
        boxShadow={"lg"}
        p={{ base: 5, md: 10 }}
        my={{ md: 12 }}
        position={"relative"}
      >
        <Heading text="Detail Transaksi" /> {/* memanggil komponen heading */}
        <Grid
          templateColumns={{ md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={10}
          my={6}
        >
          <GridItem>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Tanggal Transaksi
              </Text>
              <Input
                name="tgl_transaksi"
                id="tgl_transaksi"
                borderRadius="lg"
                focusBorderColor="green.500"
                placeholder="Tanggal Transaksi"
                {...register("tgl_transaksi")}
                isReadOnly
              />
            </Flex>
            <Flex direction="column" my={4}>
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Status Pembayaran
              </Text>
              <Select
                name="status"
                id="status"
                borderRadius="lg"
                focusBorderColor="green.500"
                placeholder="Status Pembayaran"
                {...register("status", {
                  required: true,
                })}
              >
                <option value="belum_bayar">Belum Bayar</option>
                <option value="lunas">Lunas</option>
              </Select>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Nomor Meja
              </Text>
              <Input
                name="id_meja"
                id="id_meja"
                borderRadius="lg"
                focusBorderColor="green.500"
                placeholder="Nomor Meja"
                {...register("id_meja")}
                isReadOnly
              />
            </Flex>
            <Flex direction="column" my={4}>
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Status Meja
              </Text>
              <Select
                name="status_meja"
                id="status_meja"
                borderRadius="lg"
                focusBorderColor="green.500"
                placeholder="Status Meja"
                {...register("status_meja", {
                  required: true,
                })}
              >
                <option value="terisi">Terisi</option>
                <option value="kosong">Kosong</option>
              </Select>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex direction="column">
              <Text fontSize={"sm"} fontFamily={"Poppins"}>
                Nama Pelanggan
              </Text>
              <Input
                name="nama_pelanggan"
                id="nama_pelanggan"
                borderRadius="lg"
                focusBorderColor="green.500"
                placeholder="Nama Pelanggan"
                {...register("nama_pelanggan", {
                  required: true,
                })}
              />
            </Flex>
          </GridItem>
        </Grid>
        <Heading text="Detail Pemesanan" /> {/* memanggil komponen heading */}
        <Flex flexDir={"column"}>
          {kolomMenu.map((row, indexRow) => (
            <Flex
              w={"full"}
              gap={10}
              my={6}
              alignItems={"flex-end"}
              key={indexRow}
            >
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Nama Menu
                </Text>
                <Input readOnly value={row.menu.nama_menu} />
              </Flex>
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Harga
                </Text>
                <Input readOnly value={row.menu.harga} />
              </Flex>
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Jumlah
                </Text>
                <Flex alignItems={"center"} gap={3}>
                  <Text fontSize={"md"}>
                    <Input readOnly value={row.jumlah} />
                  </Text>
                </Flex>
              </Flex>
              <Flex direction="column">
                <Text fontSize={"sm"} fontFamily={"Poppins"}>
                  Total Harga
                </Text>
                <Input readOnly value={row.harga} />
              </Flex>
            </Flex>
          ))}
          {/* jika kolom menu lebih dari 0, maka tampilkan total harga */}
          {kolomMenu.length > 0 && (
            <Text fontSize={"md"} mb={2} fontFamily={"Poppins"}>
              Total Harga : Rp.
              {/* 
            menampilkan total harga dengan menggunakan fungsi reduce
            reduce adalah fungsi yang digunakan untuk mengurangi array menjadi satu nilai
            reduce akan menghitung total harga dari semua menu yang ada
          */}
              {kolomMenu.reduce((total, item) => {
                // total adalah nilai awal, item adalah nilai yang akan dihitung
                return total + item.harga;
              }, 0)}
            </Text>
          )}
        </Flex>
      </Box>
    </Center>
  );
}
