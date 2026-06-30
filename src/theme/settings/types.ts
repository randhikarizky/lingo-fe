export type ThemeMode = "light" | "dark" | "system";

export type TargetLanguage = "en" | "id" | "ja";
export type DailyGoalMinutes = "10" | "20" | "30" | "45" | "60";
export type DefaultTutorId = "maya" | "alex" | "sora" | "ken";
export type PreferredPersonality = "santai" | "semangat" | "teliti" | "bebas";

export type SettingsValueProps = {
  themeStretch: boolean;
  themeMode: ThemeMode;
  themeDirection: "rtl" | "ltr";
  themeContrast: "default" | "bold";
  themeLayout: "mobile-first" | "vertical" | "horizontal" | "mini";
  themeColorPresets: "orange" | "default" | "cyan" | "purple" | "blue" | "red";
  targetLanguage: TargetLanguage;
  dailyGoalMinutes: DailyGoalMinutes;
  defaultTutor: DefaultTutorId;
  preferredPersonality: PreferredPersonality;
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
