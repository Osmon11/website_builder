<script setup lang="ts">
  import * as Vue from "vue";
  import {
    onMounted,
    onUnmounted,
    onErrorCaptured,
    ref,
    computed,
    watch,
    defineComponent,
    h,
    markRaw,
  } from "vue";
  import {
    compile as compileScript,
    addScopedStyle,
    adaptCreateElement,
    concatenate,
    compileTemplateForEval,
  } from "vue-inbrowser-compiler-sucrase";

  import checkTemplate from "../utils/checkTemplate";
  import evalInContext from "../utils/evalInContext";
  import requireAtRuntime from "../utils/requireAtRuntime";

  const props = defineProps({
    code: {
      type: String,
      required: true,
    },
    /**
     * Hashtable of auto-registered components
     * @example { DatePicker: VueDatePicker }
     * @example { VueDatePicker }
     */
    components: {
      type: Object,
      default: () => {},
    },
    /**
     * Hashtable of auto-registered directives
     * @example { Tooltip: VueTooltip }
     * @example { VueTooltip }
     */
    directives: {
      type: Object,
      default: () => {},
    },
    /**
     * Hashtable of modules available in require and import statements
     * in the code prop
     * @example { lodash: require("lodash") }
     * @example { moment: require("moment") }
     */
    requires: {
      type: Object,
      default: () => {},
    },
    /**
     * Outside data to the preview
     * @example { count: 1 }
     */
    dataScope: {
      type: Object,
      default: () => {},
    },
    /**
     * Avoid checking variables for availability it template
     */
    checkVariableAvailability: {
      type: Boolean,
      default: true,
    },
  });
  const emit = defineEmits(["error", "success"]);

  const scope = ref(generateScope());
  const previewedComponent = ref(
    markRaw(
      defineComponent({
        render: () => h("div"),
      })
    )
  );
  const iteration = ref(0);
  const error = ref<string | boolean>(false);
  const removeScopedStyle = ref(() => {});

  const requiresPlusVue = computed(
    (): Record<string, any> => ({
      vue: Vue,
      ...props.requires,
    })
  );

  onMounted(() => {
    renderComponent(props.code.trim());
  });
  onUnmounted(() => {
    removeStyle();
  });
  onErrorCaptured(handleError);

  watch(
    () => props.code,
    (value) => {
      renderComponent(value.trim());
    }
  );

  function handleError(err: any) {
    emit("error", err);
    error.value = err.message;
  }
  function generateScope() {
    return "v-xxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
  function removeStyle() {
    if (removeScopedStyle.value) {
      removeScopedStyle.value();
    }
  }
  async function renderComponent(code: string) {
    let options = defineComponent({});
    let style;

    const scopeAttribute = `data-${scope.value}`;
    try {
      const renderedComponent = compileScript(
        code,
        {},
        scopeAttribute
      );
      style = renderedComponent.style;
      if (renderedComponent.script) {
        // compile and execute the script
        // it can be:
        // - a script setting up variables => we set up the data property of renderedComponent
        // - a `new Vue()` script that will return a full config object
        const calcOptions = async () => {
          const script = renderedComponent.script;
          const requires: typeof props.requires =
            {};
          await Promise.allSettled(
            Object.keys(
              requiresPlusVue.value
            ).map(async (key) => {
              requires[key] =
                requiresPlusVue.value[
                  key
                ] instanceof Promise
                  ? (
                      await requiresPlusVue.value[
                        key
                      ]
                    ).default
                  : requiresPlusVue.value[key];
            })
          );

          options = defineComponent(
            evalInContext(
              script,
              (filepath) =>
                requireAtRuntime(
                  requires,
                  filepath
                ),
              adaptCreateElement,
              concatenate,
              h
            ) || {}
          );
          options.name = "CompiledExample";
        };
        await calcOptions();

        // In case the template is inlined in the script,
        // we need to compile it
        if (
          typeof options.template === "string"
        ) {
          renderedComponent.template =
            options.template;
          compileTemplateForEval(
            renderedComponent
          );
          await calcOptions();
          checkTemplate(
            {
              ...(options as any),
              template: options.template,
            },
            props.checkVariableAvailability
          );
          delete options.template;
        }

        if (props.dataScope) {
          const mergeData = {
            ...(options as any)?.data(),
            ...props.dataScope,
          };
          options.data = () => mergeData;
        }
      }

      const template =
        renderedComponent.raw.template;
      if (template) {
        checkTemplate(
          {
            ...(options as any),
            template,
          },
          props.checkVariableAvailability
        );
      }
    } catch (e) {
      handleError(e);
      return;
    }

    if (props.components) {
      if (!options.components) {
        options.components = props.components;
      } else {
        options.components = {
          ...options.components,
          ...props.components,
        };
      }
    }

    if (props.directives) {
      if (!options.directives) {
        options.directives = props.directives;
      } else {
        options.directives = {
          ...options.directives,
          ...props.directives,
        };
      }
    }

    removeStyle();

    if (style) {
      // To add the scope id attribute to each item in the html
      // this way when we add the scoped style sheet it will be applied
      options.__scopeId = scopeAttribute;
      removeScopedStyle.value = addScopedStyle(
        style,
        scope.value
      );
    }

    if (!options.render) {
      handleError({
        name: "Vue Live",
        message:
          "[Vue Live] no template or render function specified. Example cannot be rendered.",
      });
      return;
    }

    options.errorCaptured = (e: any) => {
      handleError(e);
      return false;
    };

    previewedComponent.value = markRaw(options);
    iteration.value = iteration.value + 1;
    error.value = false;
    emit("success");
  }
</script>

<template>
  <pre
    class="error"
    v-if="error"
    >{{ error }}</pre
  >
  <component
    v-else-if="previewedComponent"
    :is="previewedComponent"
    :key="iteration"
  >
    <template
      v-for="(_, name) in $slots"
      v-slot:[name]="slotData"
    >
      <slot
        :name="name"
        v-bind="slotData"
      />
    </template>
  </component>
</template>

<style>
  .error {
    color: red;
    text-align: left;
    overflow: auto;
    white-space: pre-wrap;
  }
</style>
