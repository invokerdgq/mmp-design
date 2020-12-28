<template>
 <div :class="'lean-'+ pos">
   <div :class="`status-title ${statusActive?'active':'unactive'}`">{{statusText}}</div>
 </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'

@Component({})
export default class LeanTab extends Vue {
  @Prop() pos!: string
  @Prop() statusText!: string
  @Prop() statusActive!: boolean
}
</script>

<style scoped lang="scss">
 .lean-right{
   position: absolute;
   top:0;
   right:0;
   width: 44px;
   height: 44px;
   .status-title{
     font-size: $font-size-small;
     font-weight: $font-weight-normal;
     position: absolute;
     bottom: 0;
     right:0;
     width: 64px;
     height: 17px;
     text-align: center;
     line-height: 17px;
     color:white;
     transform: rotate(45deg);
     transform-origin: 64px 17px;
   }
   .active{
     background-color: $color-theme-blue;
   }
   .unactive{
     background-color: $color-second-orange;
   }
 }
 .lean-left{
   /*后面再写*/
 }
</style>
