import { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getSettings, updateSettings as updateSettingsApi } from '../services/settingsService';

const CurrencyContext = createContext({
  currency: 'EUR',
  currencySymbol: '€',
  isLoading: true,
  updateCurrency: async () => {}
});

export function CurrencyProvider({ children }) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: Infinity
  });

  const settings = data?.data || { currency: 'EUR', currencySymbol: '€' };

  const updateCurrency = async (currency, currencySymbol) => {
    await updateSettingsApi({ currency, currencySymbol });
    queryClient.invalidateQueries({ queryKey: ['settings'] });
  };

  const formatAmount = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return `${settings.currencySymbol}0.00`;
    return `${settings.currencySymbol}${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: settings.currency,
        currencySymbol: settings.currencySymbol,
        isLoading,
        updateCurrency,
        formatAmount
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
