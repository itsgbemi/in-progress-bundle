import React from 'react';
import { SettingsSubTab } from '../SettingsSubNavBox';
import { ProfileSettingsSubView } from './settings/ProfileSettingsSubView';
import { PreferencesSettingsSubView } from './settings/PreferencesSettingsSubView';
import { BrandingSettingsSubView } from './settings/BrandingSettingsSubView';

interface AccountSettingsViewProps {
  currentSubTab?: SettingsSubTab;
  onSelectSubTab?: (tab: SettingsSubTab) => void;
  uiTheme: 'dark' | 'light';
  onToggleUiTheme: () => void;
  onSetUiTheme?: (theme: 'dark' | 'light') => void;
}

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({
  currentSubTab = 'account',
  uiTheme,
  onToggleUiTheme,
  onSetUiTheme,
}) => {
  return (
    <div className="w-full">
      {currentSubTab === 'account' && <ProfileSettingsSubView uiTheme={uiTheme} />}
      {currentSubTab === 'preferences' && (
        <PreferencesSettingsSubView
          uiTheme={uiTheme}
          onToggleUiTheme={onToggleUiTheme}
          onSetUiTheme={onSetUiTheme}
        />
      )}
      {(currentSubTab === 'workspace' || (currentSubTab as string) === 'branding') && (
        <BrandingSettingsSubView uiTheme={uiTheme} />
      )}
    </div>
  );
};
