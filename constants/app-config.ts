export type MenuType = "sidebar" | "navbar";
    export type FontFamily = "geist" | "poppins" | "roboto";

    export interface AppConfig {
      appName: string;
      logoUrl: string;
      faviconUrl: string;
      primaryColor: string;
      fontFamily: FontFamily;
      fontSize: number;
      menuType: MenuType;
      borderRadius: string;
    }

    export const APP_CONFIG: AppConfig = {
  "appName": "MY ADMIN",
  "logoUrl": "a4b7193a-14b2-49c3-9ca1-099ce8750a41.png",
  "faviconUrl": "176d6926-5c35-498a-a17a-17cccbcd2895.png",
  "primaryColor": "#0997aa",
  "fontFamily": "roboto",
  "fontSize": 14,
  "menuType": "sidebar",
  "borderRadius": "12px"
};
    