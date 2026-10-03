export type ThemeMode = 'manual' | 'system' | 'local_time' | 'scheduled';

export interface ThemeScheduleConfig {
  mode: ThemeMode;
  manualTheme: 'dark' | 'light';
  lightStartTime: string; 
  darkStartTime: string;  
}

export const DEFAULT_THEME_SCHEDULE_CONFIG: ThemeScheduleConfig = {
  mode: 'manual',
  manualTheme: 'light',
  lightStartTime: '07:00',
  darkStartTime: '19:00',
};

const THEME_MODE_KEY = 'theme_mode';
const THEME_MANUAL_KEY = 'ui_theme';
const THEME_LIGHT_START_KEY = 'theme_schedule_light';
const THEME_DARK_START_KEY = 'theme_schedule_dark';

export function getSavedThemeConfig(): ThemeScheduleConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME_SCHEDULE_CONFIG;

  const mode =
    (localStorage.getItem(THEME_MODE_KEY) as ThemeMode) ||
    (localStorage.getItem('myoffice_theme_mode') as ThemeMode) ||
    (localStorage.getItem('superreach_theme_mode') as ThemeMode) ||
    (localStorage.getItem('theme_schedule_mode') as ThemeMode) ||
    DEFAULT_THEME_SCHEDULE_CONFIG.mode;

  const manualTheme =
    (localStorage.getItem(THEME_MANUAL_KEY) as 'dark' | 'light') ||
    (localStorage.getItem('myoffice_ui_theme') as 'dark' | 'light') ||
    (localStorage.getItem('superreach_ui_theme') as 'dark' | 'light') ||
    (localStorage.getItem('theme_manual_choice') as 'dark' | 'light') ||
    (localStorage.getItem('site_theme') as 'dark' | 'light') ||
    DEFAULT_THEME_SCHEDULE_CONFIG.manualTheme;

  const lightStartTime =
    localStorage.getItem(THEME_LIGHT_START_KEY) ||
    localStorage.getItem('myoffice_theme_schedule_light') ||
    localStorage.getItem('superreach_theme_schedule_light') ||
    localStorage.getItem('theme_light_start_time') ||
    DEFAULT_THEME_SCHEDULE_CONFIG.lightStartTime;

  const darkStartTime =
    localStorage.getItem(THEME_DARK_START_KEY) ||
    localStorage.getItem('myoffice_theme_schedule_dark') ||
    localStorage.getItem('superreach_theme_schedule_dark') ||
    localStorage.getItem('theme_dark_start_time') ||
    DEFAULT_THEME_SCHEDULE_CONFIG.darkStartTime;

  return {
    mode,
    manualTheme,
    lightStartTime,
    darkStartTime,
  };
}

export function saveThemeConfig(config: Partial<ThemeScheduleConfig>): ThemeScheduleConfig {
  const current = getSavedThemeConfig();
  const updated: ThemeScheduleConfig = { ...current, ...config };

  if (typeof window !== 'undefined') {
    if (config.mode !== undefined) {
      localStorage.setItem(THEME_MODE_KEY, config.mode);
    }
    if (config.manualTheme !== undefined) {
      localStorage.setItem(THEME_MANUAL_KEY, config.manualTheme);
    }
    if (config.lightStartTime !== undefined) {
      localStorage.setItem(THEME_LIGHT_START_KEY, config.lightStartTime);
    }
    if (config.darkStartTime !== undefined) {
      localStorage.setItem(THEME_DARK_START_KEY, config.darkStartTime);
    }
    window.dispatchEvent(new CustomEvent('theme_schedule_updated', { detail: updated }));
  }

  return updated;
}

export function calculateActiveTheme(configInput?: ThemeScheduleConfig): 'dark' | 'light' {
  const config = configInput || getSavedThemeConfig();

  if (config.mode === 'manual') {
    return config.manualTheme;
  }

  if (config.mode === 'system') {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }

  const now = new Date();
  const currentHours = now.getHours();
  const currentMins = currentHours * 60 + now.getMinutes();

  if (config.mode === 'local_time') {
    if (currentHours >= 18 || currentHours < 6) {
      return 'dark';
    }
    return 'light';
  }

  if (config.mode === 'scheduled') {
    const parseTimeStr = (timeStr: string): number => {
      const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);
      return h * 60 + m;
    };

    const lightMins = parseTimeStr(config.lightStartTime);
    const darkMins = parseTimeStr(config.darkStartTime);

    if (darkMins > lightMins) {
      if (currentMins >= darkMins || currentMins < lightMins) {
        return 'dark';
      }
      return 'light';
    } else if (darkMins < lightMins) {
      if (currentMins >= lightMins || currentMins < darkMins) {
        return 'light';
      }
      return 'dark';
    } else {
      return config.manualTheme;
    }
  }

  return config.manualTheme;
}
