import React from 'react';
import { AppearanceSettings } from './AppearanceSettings';

interface PreferencesSettingsProps {
  uiTheme: 'dark' | 'light';
  onToggleUiTheme: () => void;
  onSetUiTheme?: (theme: 'dark' | 'light') => void;
}

export const PreferencesSettings: React.FC<PreferencesSettingsProps> = ({
  uiTheme,
  onToggleUiTheme,
  onSetUiTheme,
}) => {
  return (
    <div className="space-y-10">
      <AppearanceSettings uiTheme={uiTheme} onToggleUiTheme={onToggleUiTheme} onSetUiTheme={onSetUiTheme} />
    </div>
  );
};
