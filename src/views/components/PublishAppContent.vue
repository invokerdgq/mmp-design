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
   <el-form-item label="版本号"  prop="add.version"  v-if="formData.pubType === 'new'">
     <el-input
      v-model="formData.add.version"
      maxlength="25"
      show-word-limit
      @input="inputVersion"
      placeholder="版本号格式为x.x.x"
     ></el-input>
   </el-form-item>
   <el-form-item label="版本号"  v-if="formData.pubType !== 'new'" prop="edit.version">
     <el-select placeholder="请选择" v-model="formData.edit.version"  @blur="handleSelect()" @change="selectChange">
       <el-option
         v-for="item in formData.releaseList"
         :key="item.version +' '+ item.distributeType"
         :label="item.version +' '+ item.distributeType"
         :value="item.version+' '+ item.distributeType">
       </el-option>
     </el-select>
   </el-form-item>
   <el-form-item label="发布类型" v-if="formData.pubType === 'new'" prop="add.distributeType" class="multiline-radio-group">
     <el-radio-group v-model="formData.add.distributeType">
       <el-radio label="H5" border :disabled="exsitedList.indexOf('H5') !== -1">H5</el-radio>
       <el-radio label="浙政钉" border :disabled="exsitedList.indexOf('浙政钉') !== -1">H5(浙政钉)</el-radio>
       <el-radio label="浙里办" border :disabled="exsitedList.indexOf('浙里办') !== -1">H5(浙里办)</el-radio>
       <el-radio label="vue 工程源码" border :disabled="exsitedList.indexOf('vue 工程源码') !== -1">vue 工程源码</el-radio>
     </el-radio-group>
   </el-form-item>
   <el-form-item label="发布类型" v-else class="multiline-radio-group">
     <el-radio-group v-model="formData.edit.distributeType">
       <el-radio label="H5" border :disabled="formData.edit.distributeType !=='H5'">H5</el-radio>
       <el-radio label="浙政钉" border :disabled="formData.edit.distributeType !=='浙政钉'">H5(浙政钉)</el-radio>
       <el-radio label="浙里办" border :disabled="formData.edit.distributeType !=='浙里办'">H5(浙里办)</el-radio>
       <el-radio label="vue 工程源码" border :disabled="formData.edit.distributeType !=='vue 工程源码'">vue 工程源码</el-radio>
     </el-radio-group>
   </el-form-item>
   <el-form-item label="说明" class="dialog-last">
     <el-input
       type="textarea"
       placeholder="请输入内容"
       v-model="formData.add.description"
       maxlength="150"
       show-word-limit
       v-if="formData.pubType === 'new'"
     />
     <el-input
       type="textarea"
       placeholder="请输入内容"
       v-model="formData.edit.description"
       maxlength="150"
       show-word-limit
       v-else
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { publishApp } from '@/api/page/home'
import { WithCheck } from '@/utils/helper'

@Component({})
@WithCheck
export default class PublishAppContent extends Vue {
  @Prop({ default: 'right' }) labelPosition!: string
  @Prop() appInfo!: any
  @Prop() showDialog!: boolean
  selectVersionIndex: any = ''
  formData = {
    pubType: 'new',
    releaseList: [],
    add: {
      version: '',
      description: '',
      distributeType: 'H5'
    },
    edit: {
      version: '',
      description: '',
      distributeType: 'H5'
    }
  }

  exsitedList: Array<string> = []

  rules = {
    'add.version': [
      { validator: this.check('appInfo.releaseList', 'version', '版本号', 4), trigger: 'blur', required: true },
      { pattern: /^[0-9]+\.[0-9]+\.[0-9]+$/g, trigger: 'blur', message: '版本号格式为x.x.x' }
    ],
    'edit.version': [
      { required: true, trigger: 'blur', message: '版本号不能为空' }
    ],
    'add.distributeType': [
      { required: true, trigger: 'blur', message: '类型不能为空' }
    ]
  }

  publishConfirm () {
    (this.$refs.form as Form).validate(async (valid: any) => {
      if (valid) {
        if (this.formData.pubType === 'new') {
          await publishApp(this.getParams(this.formData.add, { appid: this.appInfo.id, createBy: '中' }))
        } else {
          const params = { ...this.formData.edit, ...{ version: this.formData.edit.version.split(' ')[0] } }
          await publishApp(this.getParams(params, { appid: this.appInfo.id, updateBy: '中' }))
        }
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
    (this.$refs.form as Form).clearValidate(['add.version', 'edit.version', 'add.distributeType'])
  }

  handleSelect () {
    // 暂时未想到更好的解决办法 nextTick versionSelect 还是空
    setTimeout(() => {
      (this.$refs.form as Form).validateField('edit.version', err => {
        console.log(err)
      })
    }, 200)
  }

  selectChange (val: any) {
    const arr = val.split(' ')
    if (arr.length === 2) {
      this.formData.edit.distributeType = arr[1]
    } else {
      this.formData.edit.distributeType = arr.slice(1).join(' ')
    }
  }

  inputVersion () {
    const list: Array<string> = []
    this.appInfo.releaseList.forEach((item: any) => {
      if (item.version === this.formData.add.version) {
        list.push(item.distributeType)
      }
    })
    this.exsitedList = list
    if (this.exsitedList.indexOf(this.formData.add.distributeType) !== -1) this.formData.add.distributeType = ''
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

</style>
