interface SelectOptionPair {
  id?: string;
  name?: string;
}

export interface Operation {
  /** カテゴリ */
  category: SelectOptionPair;
  /** 時間(h) */
  hour: string;
  /** コメント */
  comment: string;
  /** 機能 */
  devFunction: SelectOptionPair;
  /** 工程 */
  devPhase: SelectOptionPair;
  /** 工程(小分類) */
  devSubphase: SelectOptionPair;
  /** 指摘対応 */
  reworkFlag: string;
  order: number;
}
