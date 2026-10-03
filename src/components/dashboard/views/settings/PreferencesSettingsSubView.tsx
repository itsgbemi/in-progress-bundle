import React from 'react';
import { AppearanceSettingsSubView } from './AppearanceSettingsSubView';

interface PreferencesSettingsSubViewProps {
  uiTheme: 'dark' | 'light';
  onToggleUiTheme: () => void;
  onSetUiTheme?: (theme: 'dark' | 'light') => void;
}

export const PreferencesSettingsSubView: React.FC<PreferencesSettingsSubViewProps> = ({
  uiTheme,
  onToggleUiTheme,
  onSetUiTheme,
}) => {
  return (
    <div className="space-y-10">
      <AppearanceSettingsSubView uiTheme={uiTheme} onToggleUiTheme={onToggleUiTheme} onSetUiTheme={onSetUiTheme} />
    </div>
  );
};
