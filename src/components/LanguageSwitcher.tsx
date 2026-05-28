import { GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { supportedLanguages, SupportedLanguage } from '../i18n';

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const items = supportedLanguages.map((language) => ({
    key: language,
    label: language === 'en' ? t('common.language.english') : t('common.language.simplifiedChinese'),
  }));

  return (
    <Dropdown
      menu={{
        items,
        selectedKeys: [i18n.resolvedLanguage || i18n.language],
        onClick: async ({ key }) => {
          await i18n.changeLanguage(key as SupportedLanguage);
        },
      }}
      placement="bottomRight"
      trigger={['click']}
    >
      <Button icon={<GlobalOutlined />}>
        {t('common.language.label')}
      </Button>
    </Dropdown>
  );
}
