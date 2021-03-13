<template>
  <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      height="390"
  >
    <el-table-column
        prop="path"
        label="文件列表">
    </el-table-column>
    <el-table-column width="70" align="center">
      <template #default="scope">
        <el-tag type="success" size="small" v-if="scope.row.type==='directory'">目录</el-tag>
        <el-tag type="warning" size="small" v-if="scope.row.type==='file'">文件</el-tag>
      </template>
    </el-table-column>
    <el-table-column width="35">
      <template #default="scope">
        <a class="delete-op" @click="handleDelete(scope.row,$index)"><i class="el-icon-delete"></i></a>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "FileList",
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    tableData() {
      return this.list
    },
  },
  emits:['delete'],
  methods:{
    handleDelete(item,index) {
      this.$emit('delete',index,item)
    }
  },
  mounted() {
  }
}
</script>

<style scoped>
.file-list {
  color: #A6A6A7;
  overflow: auto;
  background: #3C3F41;
  padding: 5px;
  box-sizing: border-box;
  width: 100%;
}

.file-item {
  font-size: 14px;
  display: flex;
}

.file-path {
  margin-left: 10px;
  word-break: keep-all;
}

.delete-op {
  color: red;
  cursor: pointer;
}


</style>
