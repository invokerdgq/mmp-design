<template>
  <el-dialog
    title = '构建新应用'
    :visible.sync = 'show'
    width="40%"
    v-if="show"
  >
  <el-form class="dialog-create" :label-position="labelPosition" label-width="80px" :model="formData" :rules="rules" ref="form">
    <el-form-item label="应用名称"  prop="title">
       <el-input
         placeholder="请输入应用名称"
         v-model="formData.title"
         maxlength="50"
         show-word-limit
       ></el-input>
    </el-form-item>
    <el-form-item label="类型" required>
      <div class="dialog-create-type">
        <div class="mmp-lujing iconfont"/>
        <div class="type-dec">手机</div>
      </div>
    </el-form-item>
    <el-form-item label="说明" class="dialog-last" prop="description">
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
      <el-button @click="show = false;$message( {message: '已取消新建', showClose: true})">取消</el-button>
      <el-button type="primary" @click="createConfirm">确定</el-button>
    </div>
   </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { createApp } from '@/api/page/home'
import { noRepeat } from '@/utils/validator'
import Params from '@/utils/getParams'

@Component({})
@Params
export default class CreateAppContent extends Vue {
  @Prop({ default: 'right' }) labelPosition!: string
  @Prop() showDialog!: boolean
  @Prop() list!: Array<any>
  formData = {
    title: '',
    type: 'mobile',
    description: '',
    coverimage: ''
  }

  rules = {
    title: [
      { validator: noRepeat(this.list, 'title'), trigger: 'blur', required: true }
    ]
  }

  createConfirm () {
    (this.$refs.form as Form).validate(async (valid: any) => {
      if (valid) {
        // @ts-ignore
        await createApp(this.getParams(this.formData, '中'))
        this.$message({
          message: '新建成功',
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

  get show () {
    return this.showDialog
  }

  set show (val) {
    this.$emit('update:showDialog', val)
  }
}
</script>

<style scoped lang="scss">
 .dialog-create-type{
   width: 120px;
   height: 120px;
   border-radius: 4px;
   background: $color-theme-blue;
   color: white;
   @include flex-clo;
   [class^=mmp] {
     font-size: $icon-font-size-main;
     margin-bottom: -8px;
   }
   .type-dec{
     font-size: $font-size-small;
   }
 }
</style>
