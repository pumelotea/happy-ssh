let Client = require('ssh2-sftp-client');
let sftp = new Client();
sftp.connect({
  host: 'rpinx.com', // 服务器 IP
  port: '10022',
  username: 'root',
  password: 'zhufeng520='
}).then(() => {

  // 上传文件
  const a = sftp.fastPut('../yarn.lock', '/root/111.json',{
    concurrency: 64, // integer. Number of concurrent reads
    chunkSize: 200, // integer. Size of each read in bytes
    mode: 0o755, // mixed. Integer or string representing the file mode to set
    step: function(total_transferred, chunk, total){ // function. Called every time
      // console.log(total_transferred,chunk,total,total_transferred/total)
    }
    // a part of a file was transferred
  });
  const b = sftp.fastPut('../yarn.lock', '/root/222.json',{
    concurrency: 64, // integer. Number of concurrent reads
    chunkSize: 200, // integer. Size of each read in bytes
    mode: 0o755, // mixed. Integer or string representing the file mode to set
    step: function(total_transferred, chunk, total){ // function. Called every time
      // console.log(total_transferred,chunk,total,total_transferred/total)
    }
    // a part of a file was transferred
  });

  sftp.on('upload',function (e){
    console.log(e)
  })
  const c =  sftp.uploadDir('../test','/root/test')


  return Promise.all([c])

  // 下载文件
  // return sftp.get(localPath, romotePath);
}).then((data) => {
  // console.log(localPath + "上传完成");
  console.log(data);
  sftp.end();
}).catch((err) => {
  console.log(err, 'catch error');
});
