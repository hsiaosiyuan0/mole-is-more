import Vue from "vue";
import VTooltip from "v-tooltip";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./wasm_exec";

import "v-tooltip/dist/v-tooltip.css";

Vue.config.productionTip = false;

Vue.use(VTooltip);

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
  await go.run(inst);
})();
