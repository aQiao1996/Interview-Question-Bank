import DefaultTheme from "vitepress/theme";
import ThemeLayout from "./components/ThemeLayout.vue";
import "./style/custom.css";

export default {
  extends: DefaultTheme,
  Layout: ThemeLayout,
  // ...DefaultTheme, //或者这样写也可
};
