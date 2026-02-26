export interface User {
  id: number;
  firstName: string;
  middleName: null;
  lastName: string;
  email: string;
  mobileNumber: string;
  isActive: boolean;
  hasVerified: boolean;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  role: BusinessCategory;
}

export interface BusinessCategory {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attribute {
  id: number;
  name: string;
  value: string;
  productId: number;
}

export interface Category {
  id: number;
  name: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  businessCategoryId: number;
  parentCategoryId: null;
}

export interface Image {
  id: number;
  imageUrl: string;
  productId: number;
}

export interface Vendor {
  id: number;
  name: string;
  vendorStatus: string;
  paymentStatus: string;
  leadsCount: number;
  leadsConsumed: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  userAddressId: number;
  businessCategoryId: number;
  taxId: string;
  registeredAt: number;
  userAddress: UserAddress;
  businessCategory: BusinessCategory;
}

export interface City {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  stateId: number;
  districtId: null;
}

export interface Country {
  id: number;
  name: string;
  abbreviation?: string;
  createdAt: Date;
  updatedAt: Date;
  countryId?: number;
}

export interface State {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  countryId: number;
}

export interface District {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  stateId: number;
}

export interface UserAddress {
  id: number;
  addressLineOne: string;
  addressLineTwo: null;
  zipCode: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  countryId: number;
  stateId: number;
  districtId: null;
  cityId: number;
  country: Country;
  state: Country;
  district: null;
  city: City;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: number;
  vendorId: number;
  attributes: Attribute[];
  images: Image[];
  category: Category;
  vendor: Vendor;
}

export interface ChatHistory {
  id: number;
  senderUserId: number;
  recipientUserId: number;
  message: string;
  readAt: null;
  createdAt: Date;
  updatedAt: Date;
  recipient: Recipient;
  sender: Recipient;
}

export interface Recipient {
  id: number;
  firstName: string;
  middleName: null;
  lastName: string;
  email: null;
  mobileNumber: string;
  password: string;
  isActive: boolean;
  hasVerified: boolean;
  verifiedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
}

export interface Message {
  id: number;
  senderUserId: number;
  recipientUserId: number;
  message: string;
  readAt: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: number;
  name: string;
  price: number;
  leadsCount: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  attributes: any[];
  items: Item[];
}

export interface Item {
  id: number;
  text: string;
  icon: null;
  tag: null;
  subscriptionId: number;
}
