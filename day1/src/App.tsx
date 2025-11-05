import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { walrus } from '@mysten/walrus';

const client = new SuiClient({ url: getFullnodeUrl('testnet')} ).$extend(walrus());

export default client;

// import suiclient dari @mysten/sui/client beserta fungsi getFullnodeUrl
// import walrus dari @mysten/walrus
// deklarasikan variabel client dengan tipe SuiClient()
// didalam kurung kurawal terdapat sebuah object dengan properti url yang diisi dengan sebuah instance dari fungsi getFullnodeUrl dengan argumen 'testnet'
// alasan mengapa dibuat sebuah object dikarenakan agar kita dapat menambahkan configurasi network lainnya di masa mendatang sehingga program kita bisa multi network
// kalian bisa bebas mengubah nama variabel client sesuai keinginan kalian
// kemudian panggil method $extend dari class SuiClient, pada dasarnya itu adalah sebuah fitur yang disediakan oleh mysten labs untuk kondisi seperti ini jadi kita bisa menambahkan fitur tambahan kedalam SuiClient seperti walrus
// extend membungkus fungsi walrus()
// terakhir export default client agar bisa digunakan di file lain