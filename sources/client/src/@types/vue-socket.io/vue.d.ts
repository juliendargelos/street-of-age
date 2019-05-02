import Vue from 'vue'

type Sockets = {
  [fn: string]: (...args: any[]) => void
}

declare module 'vue/types/vue' {
  interface Vue {
    $socket: {
      emit: (eventName: string, ...args: any[]) => void
      on: (eventName: string, handler: (...args: any[]) => void) => void
    }
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    sockets?: Sockets;
  }
}
