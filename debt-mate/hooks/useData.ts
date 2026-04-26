import { useState, useEffect, useCallback } from 'react';
import { Record, Contact } from '@/types';
import { storage } from '@/utils/storage';

export function useData() {
  const [records, setRecords] = useState<Record[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [fetchedRecords, fetchedContacts] = await Promise.all([
        storage.getRecords(),
        storage.getContacts(),
      ]);
      setRecords(fetchedRecords);
      setContacts(fetchedContacts);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addRecord = async (record: Record) => {
    await storage.addRecord(record);
    setRecords(prev => [record, ...prev]);
  };

  const updateRecord = async (updatedRecord: Record) => {
    await storage.updateRecord(updatedRecord);
    setRecords(prev => prev.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  const addContact = async (contact: Contact) => {
    await storage.addContact(contact);
    setContacts(prev => [...prev, contact]);
  };

  const getOrCreateContact = async (name: string): Promise<Contact> => {
    const contact = await storage.getOrCreateContact(name);
    if (!contacts.find(c => c.id === contact.id)) {
      setContacts(prev => [...prev, contact]);
    }
    return contact;
  };

  const getTotalLent = () => records.reduce((sum, r) => sum + r.amount, 0);
  const getPendingAmount = () => records.filter(r => r.status === 'pending').reduce((sum, r) => sum + (r.amount - r.paidBack), 0);
  const getUniqueContactsCount = () => new Set(records.map(r => r.contactId)).size;

  return {
    records,
    contacts,
    loading,
    refreshData: loadData,
    addRecord,
    updateRecord,
    addContact,
    getOrCreateContact,
    getTotalLent,
    getPendingAmount,
    getUniqueContactsCount,
  };
}
