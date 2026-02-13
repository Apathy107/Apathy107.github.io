export interface User {
  id: string;
  name: string;
  role: string;
  organization: string;
}

export interface Accident {
  id: string;
  code: string; // Accident Number
  name: string;
  occurredAt: string;
  location: string;
  status: 'draft' | 'completed' | 'archived';
  deviceNo: string;
  image: string;
  weather: string;
  roadType: string;
}

export interface Person {
  id: string;
  name: string;
  idCard: string;
  phone: string;
  type: string;
  liability: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  type: string;
  violation: string;
  damage: string;
}