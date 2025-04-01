import { defineConfig } from "vitepress";
import menu from "../utils/menu.config";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "前端面试宝典",
  description: "前端面试宝典",
  srcDir: "./src", // 相对于项目根目录的 markdown 文件所在的文件夹 默认 .
  lang: "zh-CN",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "./images/logo.png",
    // 导航菜单项的配置
    nav: menu,
    // 侧边栏菜单项的配置
    sidebar: [{ text: "前端", items: menu }],
    // 可以定义此选项以在导航栏中展示带有图标的社交帐户链接
    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
    // 使用浏览器内索引进行模糊全文搜索
    search: { provider: "local" },
    // 大纲中显示的标题级别 (右侧目录)
    outline: {
      label: "目录",
    },
  },
});
