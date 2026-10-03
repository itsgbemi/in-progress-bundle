import React from 'react';
import { SettingsSubTab } from '../SettingsSubNavBox';
import { ProfileSettings } from './settings/ProfileSettings';
import { PreferencesSettings } from './settings/PreferencesSettings';
import { BrandingSettings } from './settings/BrandingSettings';

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
      {currentSubTab === 'account' && <ProfileSettings uiTheme={uiTheme} />}
      {currentSubTab === 'preferences' && (
        <PreferencesSettings
          uiTheme={uiTheme}
          onToggleUiTheme={onToggleUiTheme}
          onSetUiTheme={onSetUiTheme}
        />
      )}
      {(currentSubTab === 'workspace' || (currentSubTab as string) === 'branding') && (
        <BrandingSettings uiTheme={uiTheme} />
      )}
    </div>
  );
};
