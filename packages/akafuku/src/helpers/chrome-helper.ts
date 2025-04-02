const getCurrentTab = async (): Promise<chrome.tabs.Tab> => {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
};

export const stmt = async <TFuncReturn, TFuncArgs extends unknown[]>(
  func: (...args: TFuncArgs) => TFuncReturn,
  ...args: TFuncArgs
): Promise<TFuncReturn> => {
  const tab = await getCurrentTab();
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func,
    args,
  });
  return results[0].result as TFuncReturn;
};

export const getStorageItems = async <T>(): Promise<Record<string, T>> => {
  return chrome.storage.local.get(null);
};

export const getStorageItemByKey = async <T>(key: string): Promise<T | undefined> => {
  const result = await chrome.storage.local.get(key);
  return result[key] as T | undefined;
};

export const setStorageItem = async <T>(key: string, value: T): Promise<void> => {
  return chrome.storage.local.set({ [key]: value });
};

export const removeStorageItemByKey = async (key: string): Promise<void> => {
  return chrome.storage.local.remove(key);
};
