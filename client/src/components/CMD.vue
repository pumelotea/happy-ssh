<template>
  <div class="cmd-container">
    <div class="xterm cmd" ref="xtermRef"></div>
    <div v-if="!connectStatus" class="disconnect">
      <div v-if="!connecting">
        <div class="error-msg">{{lastErrorMsg}}</div>
        <div class="reconnect-btn" @click="connect">重新连接</div>
      </div>
      <div class="loading" v-if="connecting">
        <i class="el-icon-loading"></i>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import {Terminal} from 'xterm'
import {FitAddon} from 'xterm-addon-fit'
import {AttachAddon} from 'xterm-addon-attach'
import {defineComponent, ref, onMounted, onBeforeUnmount} from 'vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
  name: "CMD",
  props: {
    socketURI: {
      type: String,
      default: 'ws://127.0.0.1:19501'
    },
    config: {
      type: Object
    }
  },
  setup(props) {
    const id = props.config!.id
    let shellSocket: WebSocket
    let cmdSocket: WebSocket
    let term: Terminal
    let attachAddon: AttachAddon
    let fitAddon: FitAddon
    const connectStatus = ref(false)
    const connecting= ref(false)
    const xtermRef = ref<any>(null)
    const lastErrorMsg = ref('')
    function shellMessageHandle(raw: any) {
      const data = JSON.parse(raw.data)
      if (data.code === 0) {
        shellSocket.onmessage = null
        //初始化控制台
        initTerm()
        //连接控制通道
        connectCmdSocket()
        lastErrorMsg.value = ''
      } else {
        ElMessage({
          offset:40,
          message:data.msg,
          type:'error',
          showClose:true,
        })
        lastErrorMsg.value = data.msg
        connectStatus.value = false
      }
      connecting.value = false
    }

    function connectShellSocket() {
      connecting.value = true
      shellSocket = new WebSocket(props.socketURI)
      shellSocket.onopen = () => {
        shellSocket.send(JSON.stringify({
          ...props.config,
          type: 'shell'
        }))
      }

      shellSocket.onmessage = shellMessageHandle

      shellSocket.onclose = () => {
        connectStatus.value = false
        cmdSocket && cmdSocket.close()
      }

      shellSocket.onerror = (e:any) => {
        console.log(e)
      }
    }

    function connectCmdSocket() {
      cmdSocket = new WebSocket(props.socketURI)
      cmdSocket.onopen = () => {
        cmdSocket.send(JSON.stringify({
          id,
          type: 'cmd'
        }))
      }

      cmdSocket.onmessage = (raw: any) => {
        const data = JSON.parse(raw.data)
        if (data.connect === 'success') {
          resize()
        }
      }

      cmdSocket.onerror = (e:any) => {
        console.log(e)
      }
    }

    function initTerm() {
      term = new Terminal({
        fontSize: 14,
        cursorBlink: true,
      });
      attachAddon = new AttachAddon(shellSocket);
      fitAddon = new FitAddon();
      term.loadAddon(attachAddon);
      term.loadAddon(fitAddon);
      term.open(xtermRef.value!);
      fitAddon.fit();
      term.focus();
      connectStatus.value = true
    }

    onMounted(connectShellSocket)

    function resize() {
      if (!fitAddon){
        return
      }
      const {rows, cols} = fitAddon.proposeDimensions()
      term.resize(cols, rows)
      fitAddon.fit()
      term.scrollToBottom()
      cmdSocket.send(JSON.stringify({
        id,
        plan: 'resize',
        rows,
        cols
      }))
    }


    window.addEventListener('resize', resize)
    onBeforeUnmount(() => {
      shellSocket && shellSocket.close()
      window.removeEventListener('resize', resize)
    })

    function destroy() {
      if (term) {
        term.dispose()
      }
      shellSocket && shellSocket.close()
      cmdSocket && cmdSocket.close()
    }

    function connect() {
      destroy()
      connectShellSocket()
    }

    return {
      xtermRef,
      connectStatus,
      lastErrorMsg,
      connecting,
      connect
    }
  }
})
</script>

<style>
.cmd-container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  height: 100%;
}

.cmd {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.terminal {
  height: 100%;
  width: 100%;
}

.xterm-screen {
  height: 100% !important;
  width: 100%;
}

.disconnect {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  backdrop-filter: blur(5px);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
}

.reconnect-btn {
  cursor: pointer;
  color: yellow;
  font-size: 14px;
  text-align: center;
}

.error-msg{
  color: #ea3737;
  text-align: center;
  margin-bottom: 10px;
}

.loading{
  color: white;
  font-size: 30px;
}
</style>
