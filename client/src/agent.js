const Koa = require('koa2')
const route = require('koa-route')
const KoaWebsocket = require('koa-websocket')
const SSHClient = require('ssh2').Client

/**
 * 双链路设计
 * 一路交换ssh数据
 * 一路交换控制信令
 */

/**
 * 客户端连接池
 */
const connectPool = {}

const app = KoaWebsocket(new Koa())
app.ws.use((ctx, next) => {
  return next(ctx)
})

function sendTip(socket, msg) {
  socket.send(JSON.stringify(msg))
}

function openSSH(data) {
  const ssh = new SSHClient()
  connectPool[data.id].ssh = ssh
  const socket = connectPool[data.id].shell
  const {host, username, password, port, authType, secretKey} = data
  const authConfig = {
    username,
    host,
    port
  }
  if (authType === 'password') {
    authConfig['password'] = password
  }
  if (authType === 'secretKey') {
    authConfig['privateKey'] = require('fs').readFileSync(secretKey)
  }

  // 连接成功
  ssh.on('ready', () => {
    openShell(data.id)
    // 关闭连接
  }).on('close', () => {
    const shell = connectPool[data.id].shell
    const cmd = connectPool[data.id].cmd
    const stream = connectPool[data.id].stream
    if (shell) {
      shell.close()
    }
    if (cmd) {
      cmd.close()
    }
    if (stream) {
      stream.close()
    }

    //
    // socket.send('\r\n*** SSH CONNECTION CLOSED ***\r\n');
    sendTip(socket, {
      code: -1,
      msg: 'SSH连接已经关闭'
    })
    // 连接错误
  }).on('error', (err) => {
    sendTip(socket, {
      code: -1,
      msg: err.message
    })
    //
    // socket.send('\r\n*** SSH CONNECTION ERROR: ' + err.message + ' ***\r\n');
    // 连接
  }).connect(authConfig)
}

function openShell(id) {
  const ssh = connectPool[id].ssh
  const socket = connectPool[id].shell
  ssh.shell((err, stream) => {
    // 出错
    if (err) {
      sendTip(socket, {
        code: -1,
        msg: err.message
      })
      return
    }

    connectPool[id].stream = stream
    // 通知客户端完成ssh链路
    socket.send(JSON.stringify({
      id: id,
      code: 0,
      msg: '连接成功'
    }))

    // 前端发送消息
    socket.on('message', (data) => {
      stream.write(data);
    });

    // 连接断开
    socket.on('close', () => {
      ssh.end()
    })

    // 通过sh发送消息给前端
    stream.on('data', (data) => {
      socket.send(data.toString())
    })

    stream.on('close', () => {
      ssh.end()
    })
  })
}

function resizeWindow(data) {
  const stream = connectPool[data.id].stream
  stream.setWindow(data.rows, data.cols)
}

function planMessageHandle(data) {
  const socket = connectPool[data.id].cmd
  socket.on('message', (raw) => {
    console.log(raw)
    const data = JSON.parse(raw)
    switch (data['plan']) {
      case 'resize' :
        resizeWindow(data)
        break
    }
  })
}


function routeConnect(socket) {

  function routeMessageHandle(raw) {
    const data = JSON.parse(raw)
    console.log(data)
    if (!connectPool[data.id]) {
      connectPool[data.id] = {}
    }
    connectPool[data.id]['config'] = data
    switch (data['type']) {
      case 'cmd': {

        connectPool[data.id]['cmd'] = socket
        //解除socket消息绑定
        socket.off('message', routeMessageHandle)
        //通知客户端连接完成

        socket.send(JSON.stringify({
          id: data.id,
          connect: 'success'
        }))

        //移交socket控制指令消息处理器
        planMessageHandle(data)
        break
      }
      case 'shell': {
        connectPool[data.id]['shell'] = socket
        //解除socket消息绑定
        socket.off('message', routeMessageHandle)
        //连接ssh
        openSSH(data)
        break
      }
    }
  }

  //监听第一帧数据
  socket.on('message', routeMessageHandle)
}


app.ws.use(route.all('/', (ctx) => {
  //连接成功后，第一帧数据都是控制指令
  routeConnect(ctx.websocket)
}))

const port = 19501
app.listen(port, () => {
  console.log("localhost:" + port);
})
