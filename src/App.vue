<template>
  <div id="app">
    <div id="nav">
      <div id="title">
        <a href="https://github.com/hsiaosiyuan0/mole" target="_blank">mole</a>
      </div>
      <div class="desc">
        Paste your JavaScript source in left panel and see its AST in right panel. The parser is written in golang and as a sub-module in mole, running in this page via construct it into WASM
      </div>
    </div>

    <router-view />
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
#nav {
  /* padding: 30px; */
  text-align: center;
}

#title {
  display: block;
  font-size: 30px;
}

.desc {
  font-size: 14px;
  padding: 10px 0;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  clear: both;
}

#nav a.router-link-exact-active {
  color: #1d8ce0;
  text-decoration: none;
}
</style>
