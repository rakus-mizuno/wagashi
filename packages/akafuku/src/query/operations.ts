import { stmt } from '../helpers/chrome-helper';
import { type Operation } from '../interfaces/operation.interface';
import { type OperationsMutation, type OperationsQuery } from './operations-query.interface';

export const getOperations = (): Promise<OperationsQuery['operations']['payload']> => {
  const query = (): Operation[] => {
    const inputRows = [...document.getElementsByTagName('tr')].filter(
      (row, i) => row.getElementsByTagName('td').item(0)?.id === `input_category_${i}`
    );
    return inputRows
      .map((tr, i) => {
        const order = i + 1;
        const rowCategory = tr
          .getElementsByTagName('select')
          .namedItem(`report[${order}][category_id]`)
          ?.selectedOptions.item(0);
        const rowHour = tr.getElementsByTagName('input').namedItem(`report[${order}][hour]`)?.value ?? '0.00';
        const rowComment = tr.getElementsByTagName('input').namedItem(`report[${order}][comment]`)?.value ?? '';
        const rowDevFunction = tr
          .getElementsByTagName('select')
          .namedItem(`report[${order}][dev_function]`)
          ?.selectedOptions.item(0);
        const rowDebPhase = tr
          .getElementsByTagName('select')
          .namedItem(`report[${order}][dev_phase]`)
          ?.selectedOptions.item(0);
        const rowDevSubphase = tr
          .getElementsByTagName('select')
          .namedItem(`report[${order}][dev_subphase]`)
          ?.selectedOptions.item(0);
        const rowReworkFlag = tr
          .getElementsByTagName('select')
          .namedItem(`report[${order}][rework_flag]`)
          ?.selectedOptions.item(0);

        return {
          order,
          category: {
            id: rowCategory?.value,
            name: rowCategory?.textContent ?? undefined,
          },
          hour: rowHour,
          comment: rowComment,
          devFunction: {
            id: rowDevFunction?.value,
            name: rowDevFunction?.textContent ?? undefined,
          },
          devPhase: {
            id: rowDebPhase?.value,
            name: rowDebPhase?.textContent ?? undefined,
          },
          devSubphase: {
            id: rowDevSubphase?.value,
            name: rowDevSubphase?.textContent ?? undefined,
          },
          reworkFlag: rowReworkFlag?.value ?? '0',
        } satisfies Operation;
      })
      .filter(({ category }) => category.id !== undefined && category.id !== '0');
  };

  return stmt(query);
};

export const registerOperations = (
  input: OperationsMutation['registerOperation']['input']
): Promise<OperationsMutation['registerOperation']['payload']> => {
  const update = (arg: Operation[]): void => {
    const inputRows = [...document.getElementsByTagName('tr')].filter(
      (row, i) => row.getElementsByTagName('td').item(0)?.id === `input_category_${i}`
    );

    const event = new Event('change', { bubbles: true });

    for (let i = 0; i < inputRows.length; i++) {
      const operation: Operation =
        arg[i] ??
        ({
          category: { id: '0', name: '' },
          hour: '0.00',
          comment: '',
          devFunction: { id: '0', name: '' },
          devPhase: { id: '0', name: '' },
          devSubphase: { id: '0', name: '' },
          reworkFlag: '0',
          order: i + 1,
        } satisfies Operation);
      const tr = inputRows[i];

      const categorySelect = tr.getElementsByTagName('select').namedItem(`report[${operation.order}][category_id]`);
      if (categorySelect !== null && operation.category.id) {
        categorySelect.value = operation.category.id;
        categorySelect.dispatchEvent(event);
      }

      const hourInput = tr.getElementsByTagName('input').namedItem(`report[${operation.order}][hour]`);
      if (hourInput !== null) {
        hourInput.value = operation.hour;
        hourInput.dispatchEvent(event);
      }

      const commentInput = tr.getElementsByTagName('input').namedItem(`report[${operation.order}][comment]`);
      if (commentInput !== null) {
        commentInput.value = operation.comment;
        commentInput.dispatchEvent(event);
      }

      const devFunctionSelect = tr.getElementsByTagName('select').namedItem(`report[${operation.order}][dev_function]`);
      if (devFunctionSelect !== null && operation.devFunction.id) {
        devFunctionSelect.value = operation.devFunction.id;
        devFunctionSelect.dispatchEvent(event);
      }

      const devPhaseSelect = tr.getElementsByTagName('select').namedItem(`report[${operation.order}][dev_phase]`);
      if (devPhaseSelect !== null && operation.devPhase.id) {
        devPhaseSelect.value = operation.devPhase.id;
        devPhaseSelect.dispatchEvent(event);
      }

      const devSubphaseSelect = tr.getElementsByTagName('select').namedItem(`report[${operation.order}][dev_subphase]`);
      if (devSubphaseSelect !== null && operation.devSubphase.id) {
        devSubphaseSelect.value = operation.devSubphase.id;
        devSubphaseSelect.dispatchEvent(event);
      }

      const reworkFlagSelect = tr.getElementsByTagName('select').namedItem(`report[${operation.order}][rework_flag]`);
      if (reworkFlagSelect !== null) {
        reworkFlagSelect.value = operation.reworkFlag;
        reworkFlagSelect.dispatchEvent(event);
      }
    }
  };

  return stmt(update, input);
};
