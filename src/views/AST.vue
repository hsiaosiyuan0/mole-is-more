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
      selectable-type="multiple"
      :value="selected"
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
import { walk } from "../walk";

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
      selected: [],
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
      this.selected = [];

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
    },
    editorDidMount(editor) {
      this.editor = editor;
      this.editor.onMouseDown(this.handleEditorClick);
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
    handleEditorClick(e) {
      if (!this.ast) return;

      this.prevDecorations = this.editor.deltaDecorations(
        this.prevDecorations.slice(0),
        []
      );

      const { lineNumber, column } = e.target.position;
      let node = null;
      let path = "";
      walk(
        this.ast,
        (n, p) => {
          if (!n.loc) return;

          const { start, end } = n.loc;
          const inRange =
            lineNumber >= start.line &&
            column >= start.column + 1 &&
            lineNumber <= end.line &&
            column <= end.column + 1;
          if (inRange) {
            node = n;
            path = p;
          }
          return true;
        },
        "root"
      );

      if (node) {
        // you'll never want to known about below code
        // it's just for highlighting the nodes
        const objs = [{ node, path: path }];
        let keys = [];
        while (objs.length) {
          const { node, path } = objs.pop();
          const ks = Object.keys(node).map((k) => {
            const prop = node[k];
            const key = `${path}.${k}`;
            if (Object.prototype.toString.call(prop) === "[object Object]") {
              objs.push({ node: prop, path: key });
            } else if (Array.isArray(prop)) {
              prop.forEach((p, i) => {
                keys.push(`${key}[${i}]`);
                objs.push({ node: p, path: `${key}[${i}]` });
              });
            }
            return key;
          });
          keys = [...keys, ...ks];
        }

        this.selected = [path, ...keys];
      }
    },
  },
  mounted() {
    this.code = `/**
 * Go Is The Future of JavaScript Infrastructure.
 */

let tips = [
  "Clicking a node highlights the \\
   corresponding location in the source code"
];

function printTips() {
  tips.forEach((tip, i) => console.log(\`Tip \${i}:\` + tip));
}
`;

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
  background: #e6f7ff;
}

.copy {
  position: absolute;
  top: 60px;
  right: 30px;
  text-decoration: underline;
  cursor: pointer;
}
</style>

