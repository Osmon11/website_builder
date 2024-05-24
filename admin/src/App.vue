<script setup lang="ts">
  import { ref } from "vue";

  import Editor from "./components/Editor.vue";
  import Preview from "./components/Preview.vue";
  import CardSFC from "./components/Card.vue?raw";

  const stableCode = ref(CardSFC);

  function updatePreview(code: string) {
    stableCode.value = code;
  }
</script>

<template>
  <div class="container">
    <Editor
      :code="stableCode"
      @change="updatePreview"
    />
    <Preview :code="stableCode" />
  </div>
</template>

<style scoped>
  .container {
    width: 50vw;
    min-width: 500px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 20px;
    padding: 24px;
  }
  .mt_20 {
    margin-top: 20px;
  }
</style>
