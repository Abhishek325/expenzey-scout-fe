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
import { nextTick, onBeforeUnmount, ref, toRef, watch } from "vue";
import ChartSkeleton from "@/components/dashboard/ChartSkeleton.vue";
import { useRevenueTrend } from "@/composables/dashboard/useRevenueTrend";
import { useFormatCurrency } from "@/composables/useFormatCurrency";
import { useLocalizedString } from "@/composables/useLocalizedString";
import type { RevenueChartGranularity } from "@/types/metrics";
import { formatRevenueChartAxisLabel } from "@/utils/revenueTrendUtils";

const props = withDefaults(
  defineProps<{
    granularity?: RevenueChartGranularity;
  }>(),
  { granularity: "daily" }
);

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend
);

const canvasRef = ref<HTMLCanvasElement | null>(null);
const granularityRef = toRef(props, "granularity");
const { loading, trend } = useRevenueTrend(granularityRef);
const { formatCompactAxis } = useFormatCurrency();
const datasetLabel = useLocalizedString("dashboard", "revenueTrendTitle");

let chart: Chart | null = null;

function formatYAxisTick(value: number | string): string {
  const n = Number(value);
  if (Number.isNaN(n)) {
    return String(value);
  }
  return formatCompactAxis(n);
}

function renderChart() {
  if (!canvasRef.value || !trend.value?.dataPoints.length) {
    return;
  }
  chart?.destroy();
  const chartGranularity = trend.value.granularity ?? props.granularity;
  const labels = trend.value.dataPoints.map((p) =>
    formatRevenueChartAxisLabel(p.date, chartGranularity)
  );
  const data = trend.value.dataPoints.map((p) => p.revenue);
  const ctx = canvasRef.value.getContext("2d");
  let fillColor: string | CanvasGradient = "rgba(99, 102, 241, 0.12)";
  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasRef.value.height || 208);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.35)");
    gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
    fillColor = gradient;
  }
  chart = new Chart(canvasRef.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: datasetLabel.value,
          data,
          borderColor: "#6366f1",
          backgroundColor: fillColor,
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointBackgroundColor: "#6366f1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: { padding: { top: 4, right: 4, bottom: 0, left: 0 } },
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid: { display: false },
          ticks: { padding: 0, maxRotation: 0 },
        },
        y: {
          grid: { color: "#f1f5f9" },
          ticks: { padding: 4, callback: (v) => formatYAxisTick(v) },
          border: { display: false },
        },
      },
    },
  });
}

watch(
  [loading, trend, datasetLabel, granularityRef],
  async () => {
    if (loading.value || !trend.value) {
      return;
    }
    await nextTick();
    renderChart();
  },
  { immediate: true, deep: true }
);

onBeforeUnmount(() => {
  chart?.destroy();
});
</script>

<template>
  <div class="relative h-52 overflow-hidden">
    <ChartSkeleton v-if="loading" class="absolute inset-0" />
    <canvas
      v-show="!loading"
      ref="canvasRef"
      class="block h-full w-full"
      role="img"
      :aria-label="datasetLabel"
    />
  </div>
</template>
