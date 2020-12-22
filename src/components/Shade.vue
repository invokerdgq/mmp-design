<template>
 <div class="app-shade">
   <div class="opacity-bg" :style="{opacity: opacity}"></div>
   <div class="opacity-content">
     <slot></slot>
   </div>
 </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({})
export default class Shade extends Vue {
  @Prop({ default: '0.5' }) opacity!: string
}
</script>

<style scoped lang="scss">
 .app-shade{
   width: 100%;
   height: 100%;
   position: relative;
   .opacity-bg{
     width: 100%;
     height: 100%;
     background: #000000;
   }
   .opacity-content{
     position: absolute;
     top:0;
     left:0;
     width: 100%;
     height: 100%;
   }
 }
</style>
