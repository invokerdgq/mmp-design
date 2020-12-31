
import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue'{
  interface Vue {
    getParams: any
    check: any
    pageNum?: number,
    pageSize?: number,
    total?: number,
    pageList?: any,
    pageLoading?: boolean,
    toPage: (n: number) => any
    setPageSize: (n: number) => void
    resetPageOption:() => void
  }
}


