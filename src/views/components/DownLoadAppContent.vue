<template>
 <el-dialog
   title = '下载'
   :visible.sync = 'show'
   width="40%"
   v-if="show"
 >
   <el-table
     :data="appInfo.releaseList"
     style="width: 100%"
     header-row-class-name="el-table-header-tr"
     class="table-design-border-top"
     height="320px"
   >
     <el-table-column
      prop="version"
      label="版本号"
     >
     </el-table-column>
     <el-table-column
      prop="distributeType"
      label="类型"
     ></el-table-column>
     <el-table-column
      prop="desc"
      label="说明"
     ></el-table-column>
     <el-table-column
      label="操作"
     >
       <template slot-scope="{row}">
         <div class="table-feature-column">
           <el-button circle icon="mmp-download iconfont" size="mini" type="success" plain @click="downLoad"></el-button>
           <el-button circle icon="mmp-trash iconfont" size="mini" type="danger" plain @click="deleteApp(row)"></el-button>
         </div>
       </template>
     </el-table-column>
   </el-table>
 </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { deleteAppVersion } from '@/api/page/home'

@Component({})
export default class DownLoadAppContent extends Vue {
  @Prop() showDialog!: boolean
  @Prop() appInfo!: any

  get show () {
    return this.showDialog
  }

  set show (val) {
    this.$emit('update:showDialog', val)
  }

  async deleteApp (item: any) {
    this.$confirm(`删除版本【${item.version + ' ' + item.distributeType}】，是否继续`, '提示').then(async () => {
      const params = {
        appid: this.appInfo.id,
        version: item.version,
        optsBy: '中',
        distributeType: item.distributeType
      }
      await deleteAppVersion(params)
      this.$message({ type: 'success', message: '删除成功', showClose: true })
      this.$emit('update')
    }, () => {
      this.$message({ type: 'info', message: '已取消删除', showClose: true })
    })
  }

  async downLoad () {
    // 下载
  }
}
</script>

<style scoped lang="scss">
.table-design-border-top{
  border-top:solid 1px $color-border-main
}
</style>
