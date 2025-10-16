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
  type: 'heartRate' | 'weight' | 'medication';
  date: string;
  value: number;
  unit: string;
  note?: string;
}

export interface MedicationChange {
  id: string;
  date: string;
  medicationName: string;
  dosage: string;
}

const STORAGE_KEYS = {
  THYROID: 'thyroid_records',
  METRICS: 'other_metrics',
  MEDICATIONS: 'medication_changes',
};

export const useHealthRecords = () => {
  const [thyroidRecords, setThyroidRecords] = useState<ThyroidRecord[]>([]);
  const [otherMetrics, setOtherMetrics] = useState<OtherMetric[]>([]);
  const [medicationChanges, setMedicationChanges] = useState<MedicationChange[]>([]);

  // Load data from localStorage
  useEffect(() => {
    const loadedThyroid = localStorage.getItem(STORAGE_KEYS.THYROID);
    const loadedMetrics = localStorage.getItem(STORAGE_KEYS.METRICS);
    const loadedMedications = localStorage.getItem(STORAGE_KEYS.MEDICATIONS);

    if (loadedThyroid) setThyroidRecords(JSON.parse(loadedThyroid));
    if (loadedMetrics) setOtherMetrics(JSON.parse(loadedMetrics));
    if (loadedMedications) setMedicationChanges(JSON.parse(loadedMedications));
  }, []);

  // Thyroid records
  const addThyroidRecord = (record: Omit<ThyroidRecord, 'id'>) => {
    const newRecord = { ...record, id: Date.now().toString() };
    const updated = [...thyroidRecords, newRecord].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setThyroidRecords(updated);
    localStorage.setItem(STORAGE_KEYS.THYROID, JSON.stringify(updated));
  };

  const deleteThyroidRecord = (id: string) => {
    const updated = thyroidRecords.filter(r => r.id !== id);
    setThyroidRecords(updated);
    localStorage.setItem(STORAGE_KEYS.THYROID, JSON.stringify(updated));
  };

  // Other metrics
  const addMetric = (metric: Omit<OtherMetric, 'id'>) => {
    const newMetric = { ...metric, id: Date.now().toString() };
    const updated = [...otherMetrics, newMetric].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setOtherMetrics(updated);
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updated));
  };

  const updateMetric = (id: string, updates: Partial<OtherMetric>) => {
    const updated = otherMetrics.map(m => m.id === id ? { ...m, ...updates } : m);
    setOtherMetrics(updated);
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updated));
  };

  const deleteMetric = (id: string) => {
    const updated = otherMetrics.filter(m => m.id !== id);
    setOtherMetrics(updated);
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(updated));
  };

  // Medication changes
  const addMedicationChange = (medication: Omit<MedicationChange, 'id'>) => {
    const newMed = { ...medication, id: Date.now().toString() };
    const updated = [...medicationChanges, newMed].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setMedicationChanges(updated);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(updated));
  };

  const updateMedicationChange = (id: string, updates: Partial<MedicationChange>) => {
    const updated = medicationChanges.map(m => m.id === id ? { ...m, ...updates } : m);
    setMedicationChanges(updated);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(updated));
  };

  const deleteMedicationChange = (id: string) => {
    const updated = medicationChanges.filter(m => m.id !== id);
    setMedicationChanges(updated);
    localStorage.setItem(STORAGE_KEYS.MEDICATIONS, JSON.stringify(updated));
  };

  return {
    thyroidRecords,
    otherMetrics,
    medicationChanges,
    addThyroidRecord,
    deleteThyroidRecord,
    addMetric,
    updateMetric,
    deleteMetric,
    addMedicationChange,
    updateMedicationChange,
    deleteMedicationChange,
  };
};

