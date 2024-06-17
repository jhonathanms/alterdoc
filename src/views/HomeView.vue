<template>
  <div class="container_base">
    <div class="container_principal">
      <IconLogo class="w-12rem  mb-6"/>
      <BodyCmp />
    </div>
    <FooterCmp />
  </div>
</template>

<script setup lang="ts">
import IconLogo from '@/components/icons/IconLogo.vue'
import BodyCmp from '@/components/home/body/BodyCmp.vue'
import FooterCmp from '@/components/home/footer/HomeFooterCmp.vue'
</script>

<style lang="scss" scoped>
@import 'primeflex/primeflex.scss';

.container_base {
  @include styleclass(
    'flex align-items-center justify-content-center w-screen h-screen surface-100 p-3'
  );
}

.container_principal {
  border-top: solid 6px var(--primary-color);
  border-bottom: solid 6px var(--primary-color);
  border-radius: 0.75rem;
  width: 35rem;
  @include styleclass('flex flex-column align-items-center p-5 bg-white');
}
</style>
