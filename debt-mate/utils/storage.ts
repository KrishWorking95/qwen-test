import AsyncStorage from '@react-native-async-storage/async-storage';
import { Record, Contact } from '@/types';

const RECORDS_KEY = 'debt_mate_records';
const CONTACTS_KEY = 'debt_mate_contacts';

export const storage = {
  async getRecords(): Promise<Record[]> {
    try {
      const data = await AsyncStorage.getItem(RECORDS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting records:', error);
      return [];
    }
  },

  async saveRecords(records: Record[]): Promise<void> {
    try {
      await AsyncStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    } catch (error) {
      console.error('Error saving records:', error);
    }
  },

  async addRecord(record: Record): Promise<void> {
    try {
      const records = await this.getRecords();
      records.unshift(record);
      await this.saveRecords(records);
    } catch (error) {
      console.error('Error adding record:', error);
    }
  },

  async updateRecord(updatedRecord: Record): Promise<void> {
    try {
      const records = await this.getRecords();
      const index = records.findIndex(r => r.id === updatedRecord.id);
      if (index !== -1) {
        records[index] = updatedRecord;
        await this.saveRecords(records);
      }
    } catch (error) {
      console.error('Error updating record:', error);
    }
  },

  async getContacts(): Promise<Contact[]> {
    try {
      const data = await AsyncStorage.getItem(CONTACTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  },

  async saveContacts(contacts: Contact[]): Promise<void> {
    try {
      await AsyncStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  },

  async addContact(contact: Contact): Promise<void> {
    try {
      const contacts = await this.getContacts();
      contacts.push(contact);
      await this.saveContacts(contacts);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  },

  async getOrCreateContact(name: string): Promise<Contact> {
    const contacts = await this.getContacts();
    const existing = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return existing;
    }
    const newContact: Contact = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    await this.addContact(newContact);
    return newContact;
  },
};
