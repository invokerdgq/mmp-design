<template>
 <div :class="`${bgColor} icon-container`">
   <div :class="`${iconClass} iconfont`" ></div>
 </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class IconContainer extends Vue {
  @Prop() bgColor!: string
  @Prop() iconClass!: string
}
</script>

<style scoped lang="scss">
 .bg0{
   background: $color-icon-bg0;
   &:hover{
     background: $color-icon-bg0-hover;
   }
 }
 .bg1{
   background: $color-icon-bg1;
   &:hover{
     background: $color-icon-bg1-hover;
   }
 }
 .bg2{
   background: $color-icon-bg2;
   &:hover{
     background: $color-icon-bg2-hover;
   }
 }
 .bg3{
   background: $color-icon-bg3;
   &:hover{
     background: $color-icon-bg3-hover;
   }
 }
 .icon-container{
   width: 100%;
   height: 100%;
   position: relative;
   & [class^=mmp] {
     font-size: $icon-font-size-main !important;
     @include all-center;
   }
 }
</style>
