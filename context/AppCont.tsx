import React, { createContext, useContext, useState, ReactNode } from 'react';

export type TripData = { dest: string; days: string; budget: string; pref: string };

export type ItinHistItem = { id: string; date: string; trip: TripData; itin: string[] };

type AppContextType = {
  tripData: TripData;
  sTripData: (data: TripData) => void;
  itin: string[];
  sIt: (itinerary: string[]) => void;
  history: ItinHistItem[];
  sHis: (items: ItinHistItem[]) => void;
};

const defTripData: TripData = { dest: '', days: '', budget: '', pref: '' };

const AppCont = createContext<AppContextType | undefined>(undefined);

export const AppProv = ({ children }: { children: ReactNode }) => {
  const [tripData, sTripData] = useState<TripData>(defTripData);
  const [itin, sIt] = useState<string[]>([]);
  const [history, sHis] = useState<ItinHistItem[]>([]);

  return (
    <AppCont.Provider value={{ tripData, sTripData, itin, sIt, history, sHis }}>
      {children}
    </AppCont.Provider>
  );
};

export const useAppCont = (): AppContextType => {
  const cont = useContext(AppCont);
  if (!cont) {
    throw new Error('useAppCont must be used within an AppProvider');
  }
  return cont;
};