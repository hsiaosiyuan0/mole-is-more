<template>
  <div id="ast" class="two-split">
    <monaco-editor
      class="editor"
      v-model="code"
      language="javascript"
      :amdRequire="amdRequire"
      :options="editorCfg"
    ></monaco-editor>
    <vue-json-pretty
      class="json-viewer"
      :path="'res'"
      :data="ast"
    ></vue-json-pretty>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import VueJsonPretty from "vue-json-pretty";

// amdRequire = window.require;

export default {
  data() {
    return {
      editorCfg: {
        minimap: {
          enabled: false,
        },
      },
      code: "",
      ast: {},
    };
  },
  watch: {
    code(v) {
      this.compile(v);
    },
  },
  methods: {
    amdRequire: window.require,
  },
  components: {
    MonacoEditor,
    VueJsonPretty,
  },
};
</script>

<style>
.two-split {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor {
  width: 50%;
  height: calc(100vh - 30px);
}

.json-viewer {
  width: 49%;
  height: calc(100vh - 30px);
  overflow: scroll;
}
</style>

