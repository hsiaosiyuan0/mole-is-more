<template>
  <div id="ast" class="two-split">
    <monaco-editor
      ref="editor"
      class="editor"
      v-model="code"
      language="javascript"
      :amdRequire="amdRequire"
      :options="editorCfg"
      @editorDidMount="editorDidMount"
    >
    </monaco-editor>

    <vue-json-pretty
      v-if="!error && ast"
      class="json-viewer"
      :data="ast"
      :collapse-path="collapsePath"
      @click="handleAstClick"
      showLength
      showLine
    ></vue-json-pretty>

    <div v-if="!error && ast" @click="copy" class="copy">copy</div>

    <div v-if="error" class="error">
      <div>{{ error }}</div>
      <div class="issue">
        Looks like a bug? Help to improve mole by firing an
        <a href="https://github.com/hsiaosiyuan0/mole/issues" target="_blank"
          >Issue</a
        >
        :)
      </div>
    </div>
  </div>
</template>

<script>
import MonacoEditor from "vue-monaco";
import VueJsonPretty from "@hsiaosy0/vue-json-pretty";
import get from "lodash.get";
import { EventBus, EVENT_WASM_READY } from "../event";

import "@hsiaosy0/vue-json-pretty/lib/styles.css";

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
      ast: null,
      error: "",
      collapsePath: /loc/,
      editor: null,
      prevDecorations: [
        {
          range: new monaco.Range(0, 0, 0, 0),
          options: {},
        },
      ],
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
      this.error = "";
      this.ast = JSON.parse(json);
    },
    handleAstClick(path) {
      if (!this.editor) return;

      const node = getNode(this.ast, path);
      if (!node || !node.loc) return;

      const { start, end } = node.loc;

      const newDecorations = [
        {
          range: new monaco.Range(
            start.line,
            start.column + 1,
            end.line,
            end.column + 1
          ),
          options: {
            isWholeLine: false,
            className: "hg",
          },
        },
      ];
      this.prevDecorations = this.editor.deltaDecorations(
        this.prevDecorations.slice(0),
        newDecorations
      );

      console.log(2);
    },
    editorDidMount(editor) {
      this.editor = editor;
    },
    copy() {
      this.$copyText(JSON.stringify(this.ast)).then(
        () => {
          this.$notify({ type: "success", text: "copied" });
        },
        (e) => {
          this.$notify({ type: "error", text: "failed to copy: " + e });
        }
      );
    },
  },
  mounted() {
    this.code = `console.log("hello mole")`;

    EventBus.on(EVENT_WASM_READY, () => {
      if (this.error === "" && this.code !== "") {
        this.compile(this.code);
      }
    });
  },
  components: {
    MonacoEditor,
    VueJsonPretty,
  },
};

function getNode(ast, path) {
  let dot = path.indexOf(".");
  path = path.slice(dot + 1);
  let node = get(ast, path);
  if (node && node.loc) return node;

  // get parent
  dot = path.lastIndexOf(".");
  path = path.slice(0, dot);
  return get(ast, path);
}
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

.json-viewer,
.error {
  background-color: #f9f9f9;
  width: 49%;
  height: calc(100vh - 50px);
  overflow: scroll;
}

.error {
  box-sizing: border-box;
  padding: 10px 20px;
}

.issue {
  padding-top: 30px;
}

.hg {
  background: lightblue;
}

.copy {
  position: absolute;
  top: 60px;
  right: 30px;
  text-decoration: underline;
  cursor: pointer;
}
</style>

