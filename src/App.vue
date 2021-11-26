<template>
  <div id="app">
    <div id="nav">
      <div id="title">
        <div class="inner">
          <VDropdown>
            <span class="mark">?</span>
            <template #popper>
              <div class="desc">
                <p>
                  <a href="https://github.com/hsiaosiyuan0/mole" target="_blank"
                    >Mole</a
                  >
                  is a toolkit written in Golang provides various
                  functionalities to process source code of the frontend
                  projects.
                </p>
                <p>
                  This page is for demonstrating the JavaScript Parser shipped
                  within Mole which is running directly in this page base on
                  WASM.
                </p>
                <p>
                  Paste your JavaScript code in left panel and see its AST in
                  right panel.
                </p>
              </div>
            </template>
          </VDropdown>
        </div>
      </div>
    </div>

    <router-view />
    <notifications position="bottom right" />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Monaco, Menlo, Consolas, Bitstream Vera Sans Mono, monospace;
}

.mark {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bold;
  margin-left: 10px;
  font-size: 40px;
}

.v-popper__inner {
  padding: 0 20px !important;
}

#nav {
  /* padding: 30px; */
  text-align: center;
}

#title .inner {
  display: flex;
  font-size: 30px;
  margin: 0 auto;
  justify-content: flex-end;
  padding-right: 20px;
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
