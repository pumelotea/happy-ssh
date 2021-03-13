<template>
  <el-dialog
      title="上传文件"
      v-model="dialogVisible"
      width="800px"
  >
    <div class="content">
      <div class="actions">
        <div class="action">
          <el-button type="primary" size="medium">读取剪切板</el-button>
          <el-button type="primary" size="medium" @click="handleSelectFiles">选择文件</el-button>
          <el-button type="primary" size="medium" @click="handleSelectDirectory">选择目录</el-button>
          <el-button type="primary" size="medium" @click="clearFiles">清空</el-button>
          <input @change="handleFileChange" ref="fileRef" type="file" multiple="multiple" hidden/>
          <input @change="handleDirectoryChange" ref="directoryRef" type="file" multiple="multiple" hidden
                 webkitdirectory directory/>
        </div>
        <div style="flex: 1"></div>
        <div class="action">
          <el-button type="primary" size="medium">上传</el-button>
          <el-button type="danger" size="medium">取消</el-button>
        </div>
      </div>
      <div class="file-list-container">
        <div class="list">
          <div class="path">本地</div>
          <file-list :list="localFileList" @delete="handleFileListDelete"/>
        </div>
        <div class="list-split">
          <i class="el-icon-right"></i>
        </div>
        <div class="list">
          <div class="path">127.0.0.1：/aa</div>
          <file-list/>
        </div>
      </div>
      <div class="progress">
        <el-progress :text-inside="true" stroke-linecap="square" stroke-width="15" :percentage="90"></el-progress>
      </div>
    </div>
    <template #footer>
    </template>
  </el-dialog>
</template>

<script>

import FileList from "@/components/FileList";

export default {
  components: {FileList},
  data() {
    return {
      dialogVisible: false,
      localFileList: []
    }
  },
  methods: {
    handleSelectFiles() {
      this.$refs.fileRef.click()
    },
    handleSelectDirectory() {
      this.$refs.directoryRef.click()
    },
    handleFileChange(e) {
      const files = e.target.files
      if (files.length === 0) {
        return
      }
      this.localFileList.push(...[...files].map(e => {
        return {
          path: e.path,
          type: 'file'
        }
      }))
    },
    handleDirectoryChange(e) {
      const files = e.target.files
      if (files.length === 0) {
        return
      }
      const directoryName = files[0].webkitRelativePath.split('/')[0]
      this.localFileList.push({
        path: files[0].path.substring(0, files[0].path.indexOf(directoryName) + directoryName.length + 1),
        type: 'directory'
      })
    },
    clearFiles() {
      this.localFileList = []
    },
    handleFileListDelete(index, item) {
      this.localFileList.splice(index, 1)
    }
  }
}
</script>
<style scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.actions {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.action {

}

.file-list-container {
  flex: 1;
  display: flex;
  height: 0;
}

.list {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.list-split {
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.path {
  padding: 2px 0;
  text-align: center;
}

.progress {
  margin-top: 10px;
}
</style>
