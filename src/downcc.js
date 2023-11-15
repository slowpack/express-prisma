import https from "https";
import fs from "fs";
const fileUrl = 'https://raw.githubusercontent.com/xx025/carrot/main/README.md';
const destination = '/workspaces/express-prisma/download/cc.md';

https.get(fileUrl, (response) =>  {
  let data = '';

  response.on('data', (chunk) => {
    data += chunk;
  });

  response.on('end',  () => { 
    fs.writeFile(destination, data, (error) => {
      if (error) {
        console.error('写入文件时出现错误:', error);
      } else {
        console.log('文件已成功下载并重命名为 cc.md');
      }
    });
  });
}).on('error', (error) => {
  console.error('下载文件时出现错误:', error);
});
