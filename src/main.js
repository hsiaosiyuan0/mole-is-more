import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./wasm_exec";

import wasm from "!!raw-loader!./assets/mole.wasm";

Vue.config.productionTip = false;

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

async function string2ArrayBuffer(string) {
  let resolve;
  const p = new Promise((r) => (resolve = r));

  var f = new FileReader();
  f.onload = function (e) {
    resolve(e.target.result);
  };
  console.log(string)
  f.readAsArrayBuffer(new Blob([string], { type: "text/plain;charset=utf8" }));
  return p;
}

(async () => {
  const go = new Go();
  const mod = await WebAssembly.compile(await string2ArrayBuffer(wasm));
  const inst = await WebAssembly.instantiate(mod, go.importObject);
  go.run(inst);

  console.log(global.compile(`"hello world"`));
})();
