<template>
 <div :class="`bg-${bgColor} icon-container`">
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
 .bg-cyan{
   background: $color-iconBg-cyan;
   &:hover{
     background: $color-iconBg-hover-cyan;
   }
 }
 .bg-blue{
   background: $color-iconBg-blue;
   &:hover{
     background: $color-iconBg-hover-blue;
   }
 }
 .bg-orange{
   background: $color-iconBg-orange;
   &:hover{
     background: $color-iconBg-hover-orange;
   }
 }
 .bg-red{
   background: $color-iconBg-red;
   &:hover{
     background: $color-iconBg-hover-red;
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
