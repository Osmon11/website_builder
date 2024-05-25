<script setup lang="ts">
  import { ref, onMounted } from "vue";

  import Editor from "./components/Editor.vue";
  import Preview from "./components/Preview.vue";
  import CardSFC from "./components/Card.vue?raw";

  const stableCode = ref(CardSFC);
  const validSFC = ref(false);
  const loading = ref(false);

  onMounted(() => {
    loading.value = true;
    fetch("http://localhost:8000/settings")
      .then((res) => res.json())
      .then((data: { settings: string }) => {
        if (
          data?.settings &&
          typeof data.settings === "string"
        ) {
          stableCode.value = data.settings;
        }
      })
      .finally(() => {
        loading.value = false;
      });
  });

  function updatePreview(code: string) {
    stableCode.value = code;
  }
  function saveSFC() {
    if (validSFC.value) {
      fetch("http://localhost:8000/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: stableCode.value,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if ("message" in data) {
            alert(data.message);
          }
        })
        .catch(() => {
          alert("Something went wrong");
        });
    } else {
      alert("Please fix the error first");
    }
  }
</script>

<template>
  <button @click="saveSFC">Save</button>
  <div class="container mt_20">
    <Editor
      :code="stableCode"
      @change="updatePreview"
    />
    <span
      v-if="loading"
      class="loader"
    ></span>
    <Preview
      v-else
      :code="stableCode"
      @error="validSFC = false"
      @success="validSFC = true"
    />
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
  }
  .mt_20 {
    margin-top: 20px;
  }
  .loader {
    min-width: 48px;
    min-height: 48px;
    border: 5px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
