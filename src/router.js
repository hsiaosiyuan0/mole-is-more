import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: '/ast'
    },
    {
      path: "/ast",
      name: "ast",
      component: () =>
        import(/* webpackChunkName: "ast" */ "./views/AST.vue")
    }
  ]
});
