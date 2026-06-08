<script setup lang="ts">
import DefaultTheme from "vitepress/theme";
import { provide } from "vue";
import { useData } from "vitepress";

const { Layout } = DefaultTheme;
const { isDark } = useData();

function toggleAppearance(event?: MouseEvent) {
  if (
    typeof document === "undefined" ||
    !document.startViewTransition ||
    !event ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    isDark.value = !isDark.value;
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );
  const isSwitchingToDark = !isDark.value;

  const transition = document.startViewTransition(() => {
    isDark.value = !isDark.value;
  });

  void transition.ready.then(() => {
    document.documentElement.dataset.themeTransition = isSwitchingToDark
      ? "expand"
      : "shrink";

    const clipPath = isSwitchingToDark
      ? [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ]
      : [
          `circle(${endRadius}px at ${x}px ${y}px)`,
          `circle(0px at ${x}px ${y}px)`,
        ];

    document.documentElement.animate(
      { clipPath },
      {
        duration: 500,
        easing: "ease-in-out",
        fill: "both",
        pseudoElement: isSwitchingToDark
          ? "::view-transition-new(root)"
          : "::view-transition-old(root)",
      },
    );

    void transition.finished.finally(() => {
      delete document.documentElement.dataset.themeTransition;
    });
  });
}

provide("toggle-appearance", toggleAppearance);
</script>

<template>
  <Layout />
</template>
