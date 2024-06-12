<template>
  <div class="flex flex-column gap-2">
    <Button
      type="button"
      class="w-full"
      label="Salvar"
      severity="success"
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
    />
  </div>
</template>

<script setup></script>
