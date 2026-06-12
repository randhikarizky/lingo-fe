export type ThemeMode = "light" | "dark" | "system";

export type SettingsValueProps = {
  themeStretch: boolean;
  themeMode: ThemeMode;
  themeDirection: "rtl" | "ltr";
  themeContrast: "default" | "bold";
  themeLayout: "mobile-first" | "vertical" | "horizontal" | "mini";
  themeColorPresets: "orange" | "default" | "cyan" | "purple" | "blue" | "red";
};

export type SettingsContextProps = SettingsValueProps & {
  onUpdate: (name: string, value: string | boolean) => void;
  onChangeDirectionByLang: (lang: string) => void;
  canReset: boolean;
  onReset: VoidFunction;
  open: boolean;
  onToggle: VoidFunction;
  onClose: VoidFunction;
};
