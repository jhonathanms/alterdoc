import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStoreBase = defineStore('storeBase', () => {
  const togglePreview = ref<'Html' | 'Codigo'>('Codigo');

  const setTogglePreview = () => {
    togglePreview.value = togglePreview.value === 'Html'
      ? 'Codigo' : 'Html'
  }

  return { togglePreview, setTogglePreview }
})
