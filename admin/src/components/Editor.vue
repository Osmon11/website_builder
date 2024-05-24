<script setup lang="ts">
  import { ref } from "vue";

  import Prism from "prismjs";
  import { PrismEditor } from "vue-prism-editor";
  import debounce from "debounce";

  import "vue-prism-editor/dist/prismeditor.min.css";
  import "prismjs/themes/prism-okaidia.css";

  const { code } = defineProps({
    code: {
      type: String,
      required: true,
    },
  });
  const emit = defineEmits(["change"]);

  const stableCode = ref(code);
  const updatePreview = debounce(
    (value: string) => {
      emit("change", value);
    },
    300
  );

  function highlighter(code: string) {
    return Prism.highlight(
      code,
      Prism.languages.html,
      "html"
    );
  }
</script>

<template>
  <PrismEditor
    v-model="stableCode"
    @update:modelValue="updatePreview"
    :highlight="highlighter"
    :lineNumbers="true"
  />
</template>
