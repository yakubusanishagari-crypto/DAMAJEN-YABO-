import React from 'react';
import { BiographyPage } from './BiographyPage';
import { Language, Translations } from '../utils/i18n';

interface Props {
  setCurrentTab: (tab: string) => void;
  currentLang: Language;
  translations: Translations;
}

export const About: React.FC<Props> = (props) => {
  return <BiographyPage {...props} />;
};
