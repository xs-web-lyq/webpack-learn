import count from "./js/count.js";
import sum from "./js/sum";
// import "./css/index.css";
// import "./less/index.less";
// import "./sass/index.sass";
// import "./sass/index.scss";
import "./stylus/index.styl";
import "./css/iconfont.css";
import { mul } from "./js/math.js";
let a = "123";
console.log(count(2, 5), a);
console.log(sum(1, 2, 3, 4, 5, 6));
console.log(mul(1, 2));
// if (module.hot) {
//   // 监听模块变化
//   module.hot.accept("./js/count.js", () => {
//     console.log("count模块发生了变化");
//   });
//   module.hot.accept("./js/sum.js", () => {
//     console.log("sum模块发生了变化");
//   });
// }
