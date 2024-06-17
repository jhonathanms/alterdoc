<template>
  <footer class="container_footer">
    © 1989-{{ new Date().getFullYear() }} - Alterdata Software - Direitos Reservados
  </footer>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import 'primeflex/primeflex.scss';

.container_footer {
  @include styleclass('absolute bottom-0 mb-3 text-base text-600');
}
</style>
