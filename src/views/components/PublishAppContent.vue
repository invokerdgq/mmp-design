<template>
  <el-dialog
    title = '发布'
    :visible.sync = 'show'
    width="40%"
    v-if="show"
  >
 <el-form :label-position="labelPosition" label-width="80px"  class="dialog-edit" :model="formData" ref="form" :rules="rules">
   <el-form-item label-width="30px">
     <el-radio-group v-model="formData.pubType" @change="pubTypeChange">
       <el-radio label="new">发布新版本</el-radio>
       <el-radio label="update">覆盖旧版本</el-radio>
     </el-radio-group>
   </el-form-item>
   <el-form-item label="版本号"  prop="version"  v-if="formData.pubType === 'new'">
     <el-input
      v-model="formData.version"
      maxlength="25"
      show-word-limit
      @input="inputVersion"
      placeholder="版本号格式为x.x.x"
     ></el-input>
   </el-form-item>
   <el-form-item label="版本号"  v-if="formData.pubType !== 'new'" prop="versionSelect">
     <el-select placeholder="请选择" v-model="formData.versionSelect"  @blur="handleSelect()" @change="selectChange">
       <el-option
         v-for="item in formData.releaseList"
         :key="item.version +' '+ item.distributeType"
         :label="item.version +' '+ item.distributeType"
         :value="item.version+' '+ item.distributeType">
       </el-option>
     </el-select>
   </el-form-item>
   <el-form-item label="发布类型" v-if="formData.pubType === 'new'" prop="contentType" class="pub-radio-group">
     <el-radio-group v-model="formData.contentType">
       <el-radio label="H5" border :disabled="exsitedList.indexOf('H5') !== -1">H5</el-radio>
       <el-radio label="浙政钉" border :disabled="exsitedList.indexOf('浙政钉') !== -1">H5(浙政钉)</el-radio>
       <el-radio label="浙里办" border :disabled="exsitedList.indexOf('浙里办') !== -1">H5(浙里办)</el-radio>
       <el-radio label="vue 工程源码" border :disabled="exsitedList.indexOf('vue 工程源码') !== -1">vue 工程源码</el-radio>
     </el-radio-group>
   </el-form-item>
   <el-form-item label="发布类型" v-else prop="contentType" class="pub-radio-group">
     <el-radio-group v-model="formData.contentType">
       <el-radio label="H5" border :disabled="formData.contentType !=='H5'">H5</el-radio>
       <el-radio label="浙政钉" border :disabled="formData.contentType !=='浙政钉'">H5(浙政钉)</el-radio>
       <el-radio label="浙里办" border :disabled="formData.contentType !=='浙里办'">H5(浙里办)</el-radio>
       <el-radio label="vue 工程源码" border :disabled="formData.contentType !=='vue 工程源码'">vue 工程源码</el-radio>
     </el-radio-group>
   </el-form-item>
   <el-form-item label="说明" class="dialog-last">
     <el-input
       type="textarea"
       placeholder="请输入内容"
       v-model="formData.description"
       maxlength="150"
       show-word-limit
     />
   </el-form-item>
 </el-form>
    <div slot="footer">
      <el-button @click="show = false;$message({message: '已取消发布', showClose: true})">取消</el-button>
      <el-button type="primary" @click="publishConfirm">发布</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { noRepeat, versionCheck } from '@/utils/validator'
import { Form } from 'element-ui'
import { publishApp } from '@/api/page/home'

@Component({})
export default class PublishAppContent extends Vue {
  @Prop({ default: 'right' }) labelPosition!: string
  @Prop() appInfo!: any
  @Prop() showDialog!: boolean
  selectVersionIndex: any = ''
  formData = {
    pubType: 'new', // update new
    version: '',
    versionSelect: '',
    contentType: 'H5',
    description: '',
    releaseList: []
  }

  exsitedList: Array<string> = []

  rules = {
    version: [
      { validator: noRepeat(this.appInfo.releaseList, 'version', '版本号', 'distributeType'), trigger: 'blur', required: true },
      { validator: versionCheck, trigger: 'blur' }
    ],
    versionSelect: [
      { required: true, trigger: 'blur', message: '版本号不能为空' }
    ],
    contentType: [
      { required: true, trigger: 'blur', message: '类型不能为空' }
    ]
  }

  publishConfirm () {
    (this.$refs.form as Form).validate(async (valid: any) => {
      if (valid) {
        const params = new FormData()
        params.set('appid', this.appInfo.id)
        params.set('version', this.formData.pubType === 'new' ? this.formData.version : this.formData.versionSelect.split(' ')[0])
        params.set('optsBy', '中')
        params.set('distributeType', this.formData.contentType)
        params.set('desc', this.formData.description)
        await publishApp(params)
        this.$message({
          message: '发布成功',
          type: 'success',
          showClose: true
        })
        this.show = false
        this.$emit('update')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  created () {
    this.formData.releaseList = this.appInfo.releaseList
  }

  pubTypeChange () {
    (this.$refs.form as Form).clearValidate(['versionSelect', 'version'])
    this.formData.version = ''
    this.formData.versionSelect = ''
  }

  handleSelect () {
    // 暂时未想到更好的解决办法 nextTick versionSelect 还是空
    setTimeout(() => {
      (this.$refs.form as Form).validateField('versionSelect', err => {
        console.log(err)
      })
    }, 200)
  }

  selectChange (val: any) {
    // this.formData.description = this.formData.releaseList[this.selectVersionIndex].desc
    const arr = val.split(' ')
    if (arr.length === 2) {
      this.formData.contentType = arr[1]
    } else {
      this.formData.contentType = arr.slice(1).join(' ')
    }
  }

  inputVersion () {
    const list: Array<string> = []
    this.appInfo.releaseList.forEach((item: any) => {
      if (item.version === this.formData.version) {
        list.push(item.distributeType)
      }
    })
    this.exsitedList = list
    if (this.exsitedList.indexOf(this.formData.contentType) !== -1) this.formData.contentType = ''
  }

  get show () {
    return this.showDialog
  }

  set show (val) {
    this.$emit('update:showDialog', val)
  }
}
</script>

<style scoped lang="scss">
.pub-radio-group{
  .el-radio-group{
    margin-top: -10px;
    margin-right: -22px;
    .el-radio{
      margin-right: 22px;
      margin-left: 0;
      margin-top: 10px;
    }
    .el-radio.is-bordered{
      padding: 12px 10px 0 10px
    }
    .el-radio.is-bordered + .el-radio.is-bordered{
      margin-left: 0;
    }
  }
}

</style>
