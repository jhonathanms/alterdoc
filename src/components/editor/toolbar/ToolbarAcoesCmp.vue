<template>
  <div class="flex flex-column gap-2">
    <Button
      type="button"
      class="w-full"
      label="Salvar"
      severity="secondary"
      badge="CTRL + S"
      :pt="{
        badge: {
          class: 'absolute top-0 right-0',
          style: { background: '#FFFFFF00', color: 'var(--bg-danger-alhpa-90)', fontSize: '9px' }
        }
      }"
    />
    <Button
      type="button"
      class="w-full"
      label="Exportar"
      outlined
      severity="secondary"
      badge="CTR + E"
      :pt="{
        badge: {
          class: 'absolute top-0 right-0',
          style: { background: '#FFFFFF00', color: 'var(--bg-danger-alhpa-90)', fontSize: '9px' }
        }
      }"
    />
    <Button
      type="button"
      class="w-full"
      label="Cancelar"
      outlined
      severity="secondary"
      badge="ESC"
      :pt="{
        badge: {
          class: 'absolute top-0 right-0',
          style: { background: '#FFFFFF00', color: 'var(--bg-danger-alhpa-90)', fontSize: '9px' }
        }
      }"
      @click="handleCancelar"
      @keyup.="handleCancelar"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

const handleCancelar = (() => {
  router.push({ path: '/' })
});

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault()
    handleCancelar()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
});

</script>
