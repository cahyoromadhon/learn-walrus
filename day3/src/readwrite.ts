import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { walrus, WalrusFile } from '@mysten/walrus';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519'; // signer
// import { fromBase64 } from '@mysten/sui/utils' // translator
import {config} from 'dotenv';
config();
const PRIV_KEY_64 = process.env.PRIV_KEY_64 as string;

// --- Setup Walrus Client ---
const client = new SuiClient({
  url: getFullnodeUrl('testnet')
}).$extend(walrus({network: 'testnet'}));

// --- Setup Keypair ---
const keypair = Ed25519Keypair.fromSecretKey(PRIV_KEY_64);
console.log(`Menggunakan alamat signer: ${keypair.getPublicKey().toSuiAddress()}`)

// fromBase64(PRIV_KEY_64) itu berguna untuk mengubah string base64 private key kita menjadi Uint8Array atau byte data mentah karena basically dalam dunia kriptografi, string tidak akan pernah bisa langsung digunakan dan harus diubah dulu ke byte data mentah supaya bisa diproses komputer

//  Ed25519Keypair.fromSecretKey(...) itu berguna untuk mengubah byte data mentah private key kita menjadi sebuah Ed25519Keypair yang bisa kita gunakan untuk menandatangani transaksi

// Setelah Ed25519 mengenerate keypair dari private key, kita akan secara otomatis mendapatkan juga public key yang secara matematis akan didapatkan dari private key tersebut

// keypair.getPublicKey() adalah method untuk mendapatkan public key dari keypair yang sudah kita buat sebelumnya dari private key dan meneruskannya ke method toSuiAddress() untuk mengubah public key tersebut menjadi Sui address yang bisa ditampilkan dalam konsole agar kita tahu bahwa proses pembuatan keypair dari private key berhasil

async function main() {
  // --- Tahap A: Write File to Walrus ---
  console.log('\n Mempersiapkan File untuk diunggah ke Walrus...');
  const fileData = {name: 'cahyorom', project: 'DevCore DAO'};
  const fileToUpload = WalrusFile.from({
    contents: new TextEncoder().encode(JSON.stringify(fileData)), // Mengubah objek JS ke JSON string
    identifier: 'project-config.json', // Nama file di Walrus
    tags: { // Metadata tambahan
      'user-id': 'cahyo-001',
      'last-update': new Date().toISOString() // Menyimpan tanggal update terakhir
    }
  });

  try {
    console.log('Mengunggah file ke Walrus...');
    const results = await client.walrus.writeFiles({ // Mengunggah file ke Walrus
      files: [fileToUpload],
      epochs: 3,
      deletable: true,
      signer: keypair
    });
    const quiltId = results[0].id;
    console.log(`Sukses mengunggah file ke Walrus dengan Quilt ID: ${quiltId}`);

    // --- Tahap B: Read File from Walrus ---
    console.log('\nMembaca kembali file dari Walrus menggunakan Quilt ID...');
    const files = await client.walrus.getFiles({
      ids: [quiltId]
    });
    const readFile = files[0];

    const content = await readFile.json();
    const identifier = readFile.getIdentifier();
    const tags = readFile.getTags();

    console.log('Berikut adalah isi file yang dibaca dari Walrus:');
    console.log(`Identifier: ${identifier}`);
    console.log('Tags:', tags);
    console.log('Content:', content);

  } catch (error) {
    console.error('\nOperasi Gagal:', error);
  }
}

main();