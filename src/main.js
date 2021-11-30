import Vue from "vue";
import VTooltip from "v-tooltip";
import VueClipboard from "vue-clipboard2";
import Notifications from "vue-notification";
import { EventBus, EVENT_WASM_READY } from "./event";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./wasm_exec";

import "v-tooltip/dist/v-tooltip.css";

Vue.config.productionTip = false;

Vue.use(VTooltip);
Vue.use(VueClipboard);
Vue.use(Notifications);

window.require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.17.0/min/vs",
  },
});

// Before loading vs/editor/editor.main, define a global MonacoEnvironment that overwrites
// the default worker url location (used when creating WebWorkers). The problem here is that
// HTML5 does not allow cross-domain web workers, so we need to proxy the instantiation of
// a web worker through a same-domain script
window.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
  self.MonacoEnvironment = {
    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.17.0/min/'
  };
  importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.17.0/min/vs/base/worker/workerMain.js');`)}`;
  },
};

window.require(["vs/editor/editor.main"], function () {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
  });

  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
});

(async () => {
  const go = new Go();
  const response = await fetch(
    "https://blog.thehardways.me/mole-is-more/assets/mole.wasm"
  );
  const buffer = await response.arrayBuffer();
  const mod = await WebAssembly.compile(buffer);
  const inst = await WebAssembly.instantiate(mod, go.importObject);

  setTimeout(() => {
    EventBus.emit(EVENT_WASM_READY);
  }, 300);

  await go.run(inst);
})();
