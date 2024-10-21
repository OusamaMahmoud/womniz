import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import adminsEN from "../../public/locals/en/admins.json";
import productsEN from "../../public/locals/en/products.json";
import adminsAR from "../../public/locals/ar/admins.json";
import productsAR from "../../public/locals/ar/products.json";
import ordersEN from "../../public/locals/en/orders.json";
import ordersAR from "../../public/locals/ar/orders.json";
import sidebarAR from "../../public/locals/ar/sidebar.json";
import sidebarEN from "../../public/locals/en/sidebar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      admins: adminsEN,
      products: productsEN,
      orders: ordersEN,
      sidebar: sidebarEN,
    },
    ar: {
      admins: adminsAR,
      products: productsAR,
      orders: ordersAR,
      sidebar: sidebarAR,
    },
  },
  lng: localStorage.getItem("womnizLang") ?? "en", // default language
  fallbackLng: localStorage.getItem("womnizLang") ?? "en",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
