<template>
  <div id="ast" class="two-split">
    <monaco-editor
      class="editor"
      v-model="code"
      language="javascript"
      :amdRequire="amdRequire"
      :options="editorCfg"
    >
    </monaco-editor>
    <vue-json-pretty
      v-if="!error"
      class="json-viewer"
      :data="ast"
      showLength
    ></vue-json-pretty>
    <div>{{ error }}</div>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default {
  data() {
    return {
      editorCfg: {
        minimap: {
          enabled: false,
        },
        fontSize: "14px",
      },
      code: "",
      ast: {},
      error: "",
    };
  },
  watch: {
    code(v) {
      this.compile(v);
    },
  },
  methods: {
    amdRequire: window.require,
    compile(code) {
      if (!global.compile) return;

      const [json, err] = global.compile(code);
      if (err) {
        this.error = err;
        return;
      }
      this.ast = JSON.parse(json);
    },
  },
  mounted() {
    this.code = `console.log("hello mole")`;
  },
  components: {
    MonacoEditor,
    VueJsonPretty,
  },
};
</script>

<style>
.two-split {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor {
  width: 50%;
  height: calc(100vh - 50px);
}

.json-viewer {
  background-color: #f9f9f9;
  width: 49%;
  height: calc(100vh - 50px);
  overflow: scroll;
}
</style>

