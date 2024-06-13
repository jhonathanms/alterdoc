<template>
  <div class="w-full p-3 overflow-y-auto">
    <pre><code class="language-markdown" ref="codeBlock">{{ markdownContent }}
</code></pre>
  </div>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import { onMounted, ref } from 'vue'

const markdownContent = ref<string>('# Hello World\n\nThis is a markdown editor.')
const codeBlock = ref<HTMLElement | null>(null)

onMounted(() => {
  if (codeBlock.value) {
    markdownContent.value = `FORMAT: 1A
HOST: https://api.example.com
# API Title
## Subtitle
Also Markdown *formatted*. This also include1111212121212112
54
122222222222222222222222222222222222222222222222222222222222
`

    Prism.highlightElement(codeBlock.value)
  }
})
</script>

<style scoped lang="scss"></style>
