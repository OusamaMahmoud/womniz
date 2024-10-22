import { resources,defaultNS } from "../i18n/i18n";
import i18n from "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources;
  }
}