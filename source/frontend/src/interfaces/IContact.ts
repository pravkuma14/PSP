import { ApiGen_Base_CodeType } from '@/models/api/generated/ApiGen_Base_CodeType';

export interface IContactCountry {
  countryId: number;
  countryCode: string;
  description: string;
}

export interface IContactProvince {
  provinceStateId: number;
  provinceStateCode: string;
  description: string;
}

export interface IContactAddress {
  id: number;
  rowVersion: number;
  addressType: ApiGen_Base_CodeType<string>;
  streetAddress1?: string;
  streetAddress2?: string;
  streetAddress3?: string;
  municipality?: string;
  province?: IContactProvince;
  country?: IContactCountry;
  countryOther?: string;
  postal?: string;
}

export interface IContactMethod {
  id: number;
  rowVersion: number;
  contactMethodType: ApiGen_Base_CodeType<string>;
  value: string;
}

export interface IContactEntity {
  isDisabled: boolean;
  addresses?: IContactAddress[];
  contactMethods?: IContactMethod[];
  comment: string;
}

export interface IContactPerson extends IContactEntity {
  id: number;
  isDisabled: boolean;
  fullName: string;
  preferredName: string;
  useOrganizationAddress: boolean | null;
  organizations?: IContactOrganization[];
}

export interface IContactOrganization extends IContactEntity {
  id: string;
  name: string;
  alias: string;
  incorporationNumber: string;
  persons?: IContactPerson[];
}

export interface IContact {
  id: string;
  person?: IContactPerson;
  organization?: IContactOrganization;
}
