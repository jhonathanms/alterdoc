<script setup lang="ts">
import BodyCmp from '@/components/editor/body/BodyCmp.vue'
import FooterCmp from '@/components/editor/footer/FooterCmp.vue'
import ToolbarCmp from '@/components/editor/toolbar/ToolbarCmp.vue'
</script>

<template>
  <div class="container_principal">
    <aside class="container_lateral">
      <ToolbarCmp />
    </aside>

    <main class="col">
      <BodyCmp />
    </main>
  </div>

  <FooterCmp class="container_rodape" />
</template>

<style scoped lang="scss">
@import 'primeflex/primeflex.scss';

.container_principal {
  margin: 0;
  height: calc(100vh - 48px);
  @include styleclass('grid m-0 h-screen');
}

.container_main {
  margin: 0;
  @include styleclass('col p-3');
}

.container_lateral {
  width: 250px;
  height: calc(100% - 48px);
  background-color: var(--bg-default);
  @include styleclass('col-fixed p-3 justify-content-center overflow-y-auto');
}

.container_rodape {
  margin: 0;
  @include styleclass('grid fixed bottom-0 p-2 w-screen h-3rem');
}
</style>
