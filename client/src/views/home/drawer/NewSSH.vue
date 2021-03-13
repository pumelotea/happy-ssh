<template>
  <el-dialog
      title="新建连接"
      v-model="dialogVisible"
      width="700px"
  >
    <div class="content">
      <div class="server-list">
        <div class="server-item" v-for="(e,i) in serverList">
          <div class="item-name">{{ e.name }}</div>
          <div class="item-action" @click="connectServerItem(e)">
            <i class="el-icon-link"></i>
          </div>
          <div class="item-action" @click="editServerItem(i)">
            <i class="el-icon-edit"></i>
          </div>
          <div class="item-action" style="color: red" @click="deleteServerItem(i)">
            <i class="el-icon-delete"></i>
          </div>
        </div>
      </div>
      <div class="form-area">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="连接名称">
            <el-input v-model="form.name" :placeholder="form.host"></el-input>
          </el-form-item>
          <el-form-item label="鉴权方式">
            <el-radio-group v-model="form.authType">
              <el-radio label="password">账号密码</el-radio>
              <el-radio label="secretKey">秘钥</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.host"></el-input>
          </el-form-item>
          <el-form-item label="端口">
            <el-input v-model="form.port"></el-input>
          </el-form-item>
          <el-form-item label="账号">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="form.password"></el-input>
          </el-form-item>
          <el-form-item label="秘钥">
            <el-input v-model="form.secretKey">
              <template #append>
                <el-button icon="el-icon-plus" @click="selectSecretKeyRef"></el-button>
                <input @change="handleFileChange" type="file" ref="secretKeyRef" hidden>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button type="success" @click="onConnect">连接</el-button>
    </span>
    </template>
  </el-dialog>
</template>

<script>
import {deepClone} from "@/common/utils";

export default {
  data() {
    return {
      dialogVisible: false,
      serverList: [],
      form: {
        name: '',
        authType: 'password',
        host: '10.10.0.27',
        port: 22,
        username: 'root',
        password: 'lt@123456',
        secretKey: '',
      },
      editIndex: null
    }
  },
  emits:['connect'],
  methods: {
    onSubmit() {
      if (this.editIndex === null){
        const value = deepClone(this.form)
        value.name =  value.name || value.host
        this.serverList.push(value)
      }else{
        console.log(this.editIndex)
        this.serverList[Number(this.editIndex)] = deepClone(this.form)
      }
      this.saveServerList()
      this.editIndex = null
    },
    onConnect() {
      this.$emit('connect', this.form)
      this.dialogVisible = false
    },
    connectServerItem(item){
      this.$emit('connect', item)
      this.dialogVisible = false
    },
    loadServerList() {
      const data = localStorage.getItem('serverList')
      if (!data) {
        return
      }
      this.serverList = JSON.parse(data)
    },
    saveServerList() {
      localStorage.setItem('serverList', JSON.stringify(this.serverList))
    },
    deleteServerItem(index) {
      this.serverList.splice(index, 1)
      this.saveServerList()
    },
    editServerItem(index){
      this.editIndex = index
      console.log(this.editIndex)
      Object.assign(this.form,deepClone(this.serverList[index]))
    },
    open(){
      this.dialogVisible = true
    },
    selectSecretKeyRef(){
      this.$refs.secretKeyRef.click()
    },
    handleFileChange(e){
      this.form.secretKey = e.target.files[0].path
    }
  },
  mounted() {
    this.loadServerList()
  }
}
</script>
<style scoped>
.content {
  height: 100%;
  display: flex;
}

.server-list {
  width: 250px;
  height: 100%;
  overflow: auto;
  max-height: 450px;
  margin-right: 20px;
}

.server-item {
  width: 100%;
  height: 40px;
  background: #eeeeee;
  display: flex;
  align-items: center;
}

.server-item + .server-item {
  margin-top: 5px;
}

.item-name {
  flex: 1;
  padding-left: 10px;
  width: 100%;
  overflow: hidden;
  word-break: keep-all;
  text-overflow: ellipsis;
}

.item-action {
  color: #589EF8;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-action:hover {
  background: #cdcdcd;
}

.form-area {
  flex: 1;
}
</style>
<style>
.el-dialog__body{
  padding: 12px 30px;
}
</style>
