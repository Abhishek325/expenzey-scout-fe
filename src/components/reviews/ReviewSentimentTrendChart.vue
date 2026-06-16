<template>
  <article class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ title }}</p>
    <div class="relative mt-3 h-36">
      <canvas ref="canvasRef" class="block h-full w-full" role="img" :aria-label="title" />
      <p v-if="points.length === 0" class="absolute inset-0 flex items-center justify-center text-sm text-slate-400">
        {{ emptyLabel }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { ReviewSentimentTrendPoint } from "@/types/ai";
import { formatReviewTrendLabel } from "@/utils/reviewDetailUtils";

const props = withDefaults(
  defineProps<{
    title: string;
    points?: ReviewSentimentTrendPoint[];
  }>(),
  { points: () => [] },
);

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);

const emptyLabel = useLocalizedString("reports", "detail.noData");

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function renderChart() {
  if (!canvasRef.value) return;
  chart?.destroy();
  chart = null;

  const points = props.points ?? [];
  if (points.length === 0) {
    return;
  }

  const labels = points.map((p) => formatReviewTrendLabel(p.periodStart, p.periodEnd));
  const data = points.map((p) => p.positivePercent);
  const ctx = canvasRef.value.getContext("2d");
  let fillColor: string | CanvasGradient = "rgba(34, 197, 94, 0.12)";
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasRef.value.height || 208);
    gradient.addColorStop(0, "rgba(34, 197, 94, 0.3)");
    gradient.addColorStop(1, "rgba(34, 197, 94, 0)");
    fillColor = gradient;
  }

  chart = new Chart(canvasRef.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: props.title,
          data,
          borderColor: "#22c55e",
          backgroundColor: fillColor,
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointBackgroundColor: "#22c55e",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxRotation: 0, autoSkip: true },
        },
        y: {
          min: 0,
          max: 100,
          grid: { color: "#f1f5f9" },
          ticks: { callback: (v) => `${v}%` },
          border: { display: false },
        },
      },
    },
  });
}

watch(
  () => props.points,
  async () => {
    await nextTick();
    renderChart();
  },
  { immediate: true, deep: true },
);

onBeforeUnmount(() => {
  chart?.destroy();
});
</script>
