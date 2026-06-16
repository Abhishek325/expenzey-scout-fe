<template>
  <article class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
    <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ title }}</p>
    <div class="mt-3 flex items-center gap-4 sm:flex-row">
      <div class="relative h-28 w-28 shrink-0">
        <canvas ref="canvasRef" role="img" :aria-label="title" />
      </div>
      <ul class="w-full space-y-2 text-sm">
        <li class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-2 text-slate-700">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            {{ positiveLabel }}
          </span>
          <span class="text-slate-600">{{ sentiment.positive }}% ({{ sentiment.positiveCount }})</span>
        </li>
        <li class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-2 text-slate-700">
            <span class="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden="true" />
            {{ neutralLabel }}
          </span>
          <span class="text-slate-600">{{ sentiment.neutral }}% ({{ sentiment.neutralCount }})</span>
        </li>
        <li class="flex items-center justify-between gap-3">
          <span class="flex items-center gap-2 text-slate-700">
            <span class="h-2.5 w-2.5 rounded-full bg-rose-500" aria-hidden="true" />
            {{ negativeLabel }}
          </span>
          <span class="text-slate-600">{{ sentiment.negative }}% ({{ sentiment.negativeCount }})</span>
        </li>
      </ul>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ArcElement, Chart, DoughnutController, Legend, Tooltip } from "chart.js";
import { nextTick, onBeforeUnmount, ref, watch } from "vue";
import { useLocalizedString } from "@/composables/useLocalizedString";

const props = defineProps<{
  title: string;
  sentiment: {
    positive: number;
    positiveCount: number;
    neutral: number;
    neutralCount: number;
    negative: number;
    negativeCount: number;
  };
}>();

Chart.register(ArcElement, DoughnutController, Tooltip, Legend);

const positiveLabel = useLocalizedString("dashboard", "aiInsights.reviewIntelligence.positive");
const neutralLabel = useLocalizedString("reviews", "detail.neutral");
const negativeLabel = useLocalizedString("reviews", "detail.negative");

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function renderChart() {
  if (!canvasRef.value) return;
  chart?.destroy();

  const values = [
    props.sentiment.positiveCount ?? 0,
    props.sentiment.neutralCount ?? 0,
    props.sentiment.negativeCount ?? 0,
  ];
  if (values.every((v) => v <= 0)) {
    return;
  }

  chart = new Chart(canvasRef.value, {
    type: "doughnut",
    data: {
      labels: [positiveLabel.value, neutralLabel.value, negativeLabel.value],
      datasets: [
        {
          data: values,
          backgroundColor: ["#22c55e", "#fbbf24", "#f43f5e"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      cutout: "68%",
      plugins: { legend: { display: false } },
    },
  });
}

watch(
  () => props.sentiment,
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
