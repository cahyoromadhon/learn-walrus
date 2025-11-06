import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { walrus, WalrusFile } from '@mysten/walrus';

const client = new SuiClient({
  url: getFullnodeUrl('testnet')
}).$extend(walrus());

const [file1, file2] = await client.walrus.getFiles({ids: [
  'bafkreia6f7g7zv2x7x7y5q3j5z4x3y6z7y5q3j5z4x3y6z7y5q3j5z4x3y6z7',
  'bafkreib6f7g7zv2x7x7y5q3j5z4x3y6z7y5q3j5z4x3y6z7y5q3j5z4x3y6z8'
]});

console.log('File 1:', file1);
console.log('File 2:', file2);

// ids: input tetap menggunakan array maupun itu value nya satu karena API berusaha menjaga konsistensinya dalam menerima input

// const bytes = await file3.bytes();
// const text = await file4.text();
// const json = await file5.json();

// ketika data pertama kali diterima maka data tersebut masih bersifat mentah dan method diatas inilah yang membantu untuk mengubahnya kedalam bentuk yang sesuai
// biasanya bytes digunakan untuk file .png .jpg .mp4 dll
// text digunakan untuk file .md .txt dll
// json digunakan untuk file .json

// WalrusFile juga memiliki property tambahan jika menggunakan Quilt seperti identifier dan metadata
const identifier: string | null = await file1.getIdentifier();
const tags: Record<string, string> = await file1.getTags();
console.log('Identifier:', identifier);
console.log('Tags:', tags);

// You can use Blobid instead of Fileid
const blobId = 'bafkreia6f7g7zv2x7x7y5q3j5z4x3y6z7y5q3j5z4x3y6z7y5q3j5z4x3y6z7';
const blob = await client.walrus.getBlob({ blobId });
console.log('Blob:', blob);

// Apabila blob ternyata adalah sebuah Quilt file
const files = await blob.files(); // get all files
const [readme] = await blob.files({ identifiers: ['README.md'] }); // get specific file by identifier
const textFiles: WalrusFile[] = await blob.files({ tags: [{ 'content-type': 'text/plain'}] }); // get files by tags
const quiltId = 'quilt:your-quilt-identifier-here'; 
const fileById = await blob.files({ ids: [quiltId] }); // get file by Quilt ID

console.log('Files in Blob:', files);
console.log('README.md File:', readme);
console.log('Text Files:', textFiles);
console.log('File by Quilt ID:', fileById);