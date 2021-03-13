<template>
  <div class="page">
    <div class="drag-bar">
      <div class="title">
        HappySSH
      </div>
    </div>
    <div class="actions">
      <a class="action" @click="openNewSSHDrawer"><i class="el-icon-plus"></i></a>
    </div>
    <div class="header">
      <div class="tabs">
        <template v-for="(e,i) in tabList" :key="e.id">
          <div class="tab" :class="{'active-tab':e.id===activeTab}"
               @click="handleTabClick(e)">
            <div class="tab-name">{{ e.host }}</div>
            <div class="tab-icon"><i class="el-icon-upload2"></i></div>
            <div class="tab-icon"><i class="el-icon-download"></i></div>
            <div class="tab-icon" @click.stop="handleTabClose(i)"><i class="el-icon-close"></i></div>
          </div>
        </template>
      </div>
    </div>
    <div class="content">
      <div style="flex: 1;position: relative">
        <div class="no-tab" v-if="tabList.length ===0">
          <div class="new-ssh" @click="openNewSSHDrawer">
            新建连接
          </div>
        </div>
        <cmd v-for="e in tabList" :key="e.id" :config="e" :id="e.id" :style="e.id===activeTab?'':'z-index:-1'"></cmd>
      </div>
    </div>
    <new-ssh ref="newSSH" @connect="newConnect"/>
    <uploader/>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue'
import NewSSH from './drawer/NewSSH.vue'
import Uploader from './drawer/Uploader.vue'
import {uuid} from "@/common/utils";
import CMD from "@/components/CMD.vue";


export default defineComponent({
  name: 'Xterm',
  components: {
    'cmd': CMD,
    'new-ssh': NewSSH,
    Uploader,
  },
  setup() {
    const tabList = ref<any[]>([])
    const activeTab = ref('')
    const newSSH = ref<any>(null)

    function newConnect(config: any) {
      const id = uuid()
      tabList.value.push({
        ...config,
        id
      })
      activeTab.value = id
    }

    function openNewSSHDrawer() {
      newSSH.value!.open()
    }

    function handleTabClick(tabData: any) {
      activeTab.value = tabData.id
    }

    function handleTabClose(index: number) {
      const delItem: any[] = tabList.value.splice(index, 1)
      if (delItem[0].id === activeTab.value) {
        let preIndex = 0
        if (index > 0) {
          preIndex = index - 1
        }
        const item = tabList.value[preIndex]
        if (item) {
          activeTab.value = item.id
        }
      }
    }

    onMounted(() => {
      openNewSSHDrawer()
    })
    return {
      tabList,
      newConnect,
      openNewSSHDrawer,
      handleTabClick,
      handleTabClose,
      newSSH,
      activeTab,
    }
  }
})
</script>
<style scoped>
.page {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  min-height: 34px;
  display: flex;
  margin-top: 40px;
}

.drag-bar {
  position: fixed;
  left: 0;
  top: 0;
  height: 40px;
  right: 0;
  z-index: 9999;
  -webkit-user-select: none;
  -webkit-app-region: drag;
}

.title {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
}

.tabs {
  flex: 1;
  background: #2B2B2B;
  display: flex;
  flex-wrap: wrap;
  transition: all 0.3s;
}

.actions {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  right: 10px;
  top: 6px;
  z-index: 99999;
}

.action {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: all 0.3s;
  border-radius: 2px;
  color: #BBBBBB;
}

.active-tab {
  border-bottom: 2px solid rgb(82 249 104);
}

.action:hover {
  background: #e8ebf1;
}

.content {
  width: 100%;
  flex: 1;
  background: #2B2B2B;
  display: flex;
}

.tab {
  width: 200px;
  height: 30px;
  background: #4e5256;
  display: flex;
  align-items: center;
  font-size: 12px;
  padding: 0 10px;
  box-sizing: border-box;
  margin: 2px;
  transition: background-color 0.3s;
  color: #BBBBBB;
}

.tab:hover {
  background: #343438;
}

.tab-name {
  flex: 1;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
}

.tab-icon {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border-radius: 2px;
  transition: background-color 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tab-icon:hover {
  background: #595F63;
}

.no-tab{
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.new-ssh{
  padding: 26px 60px;
  font-size: 18px;
  border: 1px solid;
  color: #7d7c7c;
  transition: 0.3s;
  cursor: default;
  user-select: none;
}

.new-ssh:hover{
  background: #5a5959;
  color: white;
}
</style>

