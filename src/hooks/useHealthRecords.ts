import { useState, useEffect } from 'react';

export interface ThyroidRecord {
  id: string;
  date: string;
  ft3: number;
  ft4: number;
  tsh: number;
}

export interface OtherMetric {
  id: string;
  date: string;
  type: 'heartRate' | 'weight';
  value: number;
}

export interface MedicationChange {
  id: string;
  date: string;
  medicationName: string;
  dosage: string;
  notes?: string;
}

export interface MedicationCheck {
  date: string;
  morning: boolean;
  afternoon: boolean;
  evening: boolean;
}

const THYROID_KEY = 'thyroid_records';
const METRICS_KEY = 'other_metrics';
const MEDICATION_KEY = 'medication_changes';
const MEDICATION_CHECK_KEY = 'medication_checks';

export const useHealthRecords = () => {
  const [thyroidRecords, setThyroidRecords] = useState<ThyroidRecord[]>([]);
  const [otherMetrics, setOtherMetrics] = useState<OtherMetric[]>([]);
  const [medicationChanges, setMedicationChanges] = useState<MedicationChange[]>([]);
  const [medicationChecks, setMedicationChecks] = useState<MedicationCheck[]>([]);

  useEffect(() => {
    const loadedThyroid = localStorage.getItem(THYROID_KEY);
    const loadedMetrics = localStorage.getItem(METRICS_KEY);
    const loadedMedication = localStorage.getItem(MEDICATION_KEY);
    const loadedChecks = localStorage.getItem(MEDICATION_CHECK_KEY);
    
    if (loadedThyroid) setThyroidRecords(JSON.parse(loadedThyroid));
    if (loadedMetrics) setOtherMetrics(JSON.parse(loadedMetrics));
    if (loadedMedication) setMedicationChanges(JSON.parse(loadedMedication));
    if (loadedChecks) setMedicationChecks(JSON.parse(loadedChecks));
  }, []);

  const addThyroidRecord = (record: Omit<ThyroidRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    const updated = [...thyroidRecords, newRecord].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setThyroidRecords(updated);
    localStorage.setItem(THYROID_KEY, JSON.stringify(updated));
    return newRecord;
  };

  const addMetric = (metric: Omit<OtherMetric, 'id'>) => {
    const newMetric = { ...metric, id: Date.now().toString() };
    const updated = [...otherMetrics, newMetric].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setOtherMetrics(updated);
    localStorage.setItem(METRICS_KEY, JSON.stringify(updated));
    return newMetric;
  };

  const addMedicationChange = (change: Omit<MedicationChange, 'id'>) => {
    const newChange = { ...change, id: Date.now().toString() };
    const updated = [...medicationChanges, newChange].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setMedicationChanges(updated);
    localStorage.setItem(MEDICATION_KEY, JSON.stringify(updated));
    return newChange;
  };

  const updateMedicationCheck = (date: string, period: 'morning' | 'afternoon' | 'evening', checked: boolean) => {
    const existing = medicationChecks.find(c => c.date === date);
    let updated: MedicationCheck[];
    
    if (existing) {
      updated = medicationChecks.map(c => 
        c.date === date ? { ...c, [period]: checked } : c
      );
    } else {
      updated = [...medicationChecks, { 
        date, 
        morning: period === 'morning' ? checked : false,
        afternoon: period === 'afternoon' ? checked : false,
        evening: period === 'evening' ? checked : false
      }];
    }
    
    setMedicationChecks(updated);
    localStorage.setItem(MEDICATION_CHECK_KEY, JSON.stringify(updated));
  };

  const getTodayMedicationCheck = () => {
    const today = new Date().toISOString().split('T')[0];
    return medicationChecks.find(c => c.date === today) || { date: today, morning: false, afternoon: false, evening: false };
  };

  const deleteMedicationChange = (id: string) => {
    const updated = medicationChanges.filter(c => c.id !== id);
    setMedicationChanges(updated);
    localStorage.setItem(MEDICATION_KEY, JSON.stringify(updated));
  };

  const deleteMetric = (id: string) => {
    const updated = otherMetrics.filter(m => m.id !== id);
    setOtherMetrics(updated);
    localStorage.setItem(METRICS_KEY, JSON.stringify(updated));
  };

  return {
    thyroidRecords,
    otherMetrics,
    medicationChanges,
    medicationChecks,
    addThyroidRecord,
    addMetric,
    addMedicationChange,
    updateMedicationCheck,
    getTodayMedicationCheck,
    deleteMedicationChange,
    deleteMetric,
  };
};
