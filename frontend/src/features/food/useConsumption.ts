import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import { api, type ConsumeError } from '../../api/client';

export interface ConsumePayload {
  foodId: string;
  quantity: number;
  member: string;
  date: Dayjs;
}

export interface ConsumptionState {
  submitting: boolean;
  consumingId?: string;
  error: ConsumeError | null;
  successMessage: string;
}

export function useConsumption(onConsumed: () => void) {
  const [state, setState] = useState<ConsumptionState>({
    submitting: false,
    error: null,
    successMessage: '',
  });

  const submit = async (payload: ConsumePayload) => {
    setState((prev) => ({ ...prev, submitting: true, consumingId: payload.foodId, error: null, successMessage: '' }));
    try {
      const result = await api.consume({
        foodId: payload.foodId,
        quantity: payload.quantity,
        member: payload.member,
        date: payload.date.format('YYYY-MM-DD'),
      });
      setState({
        submitting: false,
        consumingId: undefined,
        error: null,
        successMessage: result.fullyConsumed
          ? `${result.foodName} 已全部消耗完（${result.date} ${result.member}），已转为“已消耗”。`
          : `${result.member} 于 ${result.date} 消耗 ${result.foodName} ${result.quantity}${result.unit}，当前剩余 ${result.remaining}${result.unit}。`,
      });
      onConsumed();
      return result;
    } catch (err) {
      setState({ submitting: false, consumingId: undefined, error: err as ConsumeError, successMessage: '' });
      return null;
    }
  };

  return { ...state, submit };
}
