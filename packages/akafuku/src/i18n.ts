import i18n, { type Resource } from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources: Resource = {
  ja: {
    translation: {
      operation: {
        category: 'カテゴリ',
        hour: '時間(h)',
        comment: 'コメント',
        devFunction: '機能',
        devPhase: '工程',
        devSubphase: '工程(小分類)',
        reworkFlag: '指摘対応',
      },
      button: {
        cancel: 'キャンセル',
        delete: '削除',
        favorite: 'お気に入り保存',
        load: '読み込み',
        apply: '反映',
        save: '保存',
      },
      dialog: {
        title: 'お気に入りに保存する',
        nameLabel: '名前',
      },
      feedback: {
        empty: 'データがありません',
      },
      note: {
        favorite: 'お気に入りは最大{{max}}件まで保存できます。上限を超えると古いものから削除されます。',
      },
      select: {
        label: 'お気に入りを選択',
      },
    },
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ja',
    interpolation: { escapeValue: false },
  })
  .catch(() => {
    /* empty */
  });

export default i18n;
