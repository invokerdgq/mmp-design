<template>
 <div class="create-config strench">
  <NavLeft
    :allow-design="false"
    :current-node-key="currentNode"
    theme="light"
    ref="navLeft"
    :data="data"
    @node="nodeChange"
  >
    <div slot="header" class="design-dec">
      <span class="mmp-yypz iconfont"></span>
      <span class="dec">应用配置</span>
    </div>
  </NavLeft>
   <div class="design-content">
      <el-container>
        <el-header>
          <el-button type="primary">{{configType | getConfig}}</el-button>
        </el-header>
        <el-main>
          <el-form :model="formData" :rules="rules" ref="form">
            <el-form-item prop="base.url" label-width="140px" label="后台支撑服务地址" v-if="configType === 'base'" key="1">
              <el-input
                v-model="formData.base.backEndUrl"
                maxlength="500"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label-width="110px" label="关联pc端应用" v-if="configType === 'connect'" key="2">
              <el-select v-model="formData.connect.relatedBusiness">
                <el-option
                 v-for="item in connectionList"
                 :label="item"
                 :value="item"
                 :key="item"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="110px" label="说明" v-if="configType === 'connect'" key="3">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="formData.connect.relatedBusinessDescription"
                maxlength="150"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label-width="80px" label="CorpId" v-if="configType === 'ding'" key="4">
              <el-input
                v-model="formData.ding.corpId"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label-width="80px" label="AppKey" v-if="configType === 'ding'" key="5">
              <el-input
                v-model="formData.ding.appKey"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label-width="80px" label="AppSecret" v-if="configType === 'ding'" key="6">
              <el-input
                v-model="formData.ding.appSecret"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label-width="80px" label="CorpId" v-if="configType === 'ban'" key="7">
              <el-input
                v-model="formData.ban.corpId"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label-width="80px" label="AppKey" v-if="configType === 'ban'" key="8">
              <el-input
                v-model="formData.ban.appKey"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item label-width="80px" label="AppSecret" v-if="configType === 'ban'" key="9">
              <el-input
                v-model="formData.ban.appSecret"
                maxlength="100"
                show-word-limit
              ></el-input>
            </el-form-item>
            <el-form-item>
              <div class="save-container"><el-button type="primary" @click="save" v-if="configType !== 'icon'">保存</el-button></div>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
   </div>
 </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavLeft from '@/components/NavLeft.vue'
import { editApp } from '@/api/page/home'
import { WithParams } from '@/utils/helper'

@WithParams()
@Component({
  components: {
    NavLeft
  }
})
export default class ConfigDesign extends Vue {
  currentNode = ''
  configType = 'base'
  connectionList = []
  data = [
    {
      id: '1',
      label: '基础设置',
      type: 'base',
      icon: 'mmp-set iconfont'
    },
    {
      id: '2',
      label: '业务关联',
      type: 'connect',
      icon: 'mmp-ywgl iconfont'
    },
    {
      id: '3',
      label: '图标设置',
      type: 'icon',
      icon: 'mmp-sidebar iconfont'
    },
    {
      id: '4',
      label: '浙政钉设置',
      type: 'ding',
      icon: 'mmp-zzdsz iconfont'
    },
    {
      id: '5',
      label: '浙里办设置',
      type: 'ban',
      icon: 'mmp-zlbsz iconfont'
    }
  ]

  formData = {
    base: {
      backEndUrl: ''
    },
    connect: {
      relatedBusiness: '',
      relatedBusinessDescription: ''
    },
    icon: {},
    ding: {
      corpId: '',
      appKey: '',
      appSecret: ''
    },
    ban: {
      corpId: '',
      appKey: '',
      appSecret: ''
    }
  }

  rules = {
    'base.url': [
      { required: true, trigger: 'blur', message: '后台支撑服务地址不能为空' }
    ]
  }

  nodeChange (data: any) {
    this.configType = data.type
  }

  save () {
    (this.$refs.form as any).validate(async (valid: boolean) => {
      if (valid) {
        let obj
        switch (this.configType) {
          case 'base':
            obj = this.formData.base
            break
          case 'connect':
            obj = this.formData.connect
            break
          case 'ding':
            obj = { zheJiangGovDingTalk: this.formData.ding }
            break
          default :
            obj = { ZheJiangGov: this.formData.ban }
        }
        await editApp(this.getParams(obj, { createBy: '中' }))
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }
    })
  }
}
</script>

<style scoped lang="scss">
/deep/ .nav-left{
  height: 100%;
}
.strench{
  padding: 0 !important;
  display: flex;
}
</style>
