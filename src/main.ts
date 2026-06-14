import { createApp } from "vue";
import { createPinia } from "pinia";
import { setupCalendar } from "v-calendar";
import App from "@/App.vue";
import router from "@/router";
// Register Pinia stores in the entry bundle before lazy route chunks load.
import "@/stores/dateRange";
import "@/stores/opportunitiesStore";
import "@/style.css";
import "v-calendar/style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "@/types/wp";
import { createServices } from "@/services/createServices";
import { applyWpBootstrap } from "@/services/wp/applyWpBootstrap";
import { STRING_SERVICE_KEY } from "@/services/stringService";
import { METRICS_SERVICE_KEY } from "@/services/metrics/IMetricsService";
import { PRODUCTS_SERVICE_KEY } from "@/services/products/IProductsService";
import { REPORTS_SERVICE_KEY } from "@/services/reports/IReportsService";
import { CHAT_SERVICE_KEY } from "@/services/chat/IChatService";
import { USAGE_SERVICE_KEY } from "@/services/usage/IUsageService";
import { SNAPSHOT_SERVICE_KEY } from "@/services/snapshot/ISnapshotService";

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();
  const services = createServices();

  app.use(pinia);
  setupCalendar(app, {});

  app.provide(STRING_SERVICE_KEY, services.stringService);
  app.provide(METRICS_SERVICE_KEY, services.metricsService);
  app.provide(PRODUCTS_SERVICE_KEY, services.productsService);
  app.provide(REPORTS_SERVICE_KEY, services.reportsService);
  app.provide(CHAT_SERVICE_KEY, services.chatService);
  app.provide(USAGE_SERVICE_KEY, services.usageService);
  app.provide(SNAPSHOT_SERVICE_KEY, services.snapshotService);

  await applyWpBootstrap(pinia, services.stringService);

  app.use(router);
  await router.isReady();
  app.mount("#expenzey-ai-app");
}

void bootstrap();
