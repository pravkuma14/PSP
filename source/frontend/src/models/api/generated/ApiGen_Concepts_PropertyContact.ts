/**
 * File autogenerated by TsGenerator.
 * Do not manually modify, changes made to this file will be lost when this file is regenerated.
 */
import { ApiGen_Base_BaseAudit } from './ApiGen_Base_BaseAudit';
import { ApiGen_Concepts_Organization } from './ApiGen_Concepts_Organization';
import { ApiGen_Concepts_Person } from './ApiGen_Concepts_Person';

// LINK: @backend/apimodels/Models/Concepts/Property/PropertyContactModel.cs
export interface ApiGen_Concepts_PropertyContact extends ApiGen_Base_BaseAudit {
  id: number;
  propertyId: number;
  organizationId: number | null;
  organization: ApiGen_Concepts_Organization | null;
  personId: number | null;
  person: ApiGen_Concepts_Person | null;
  primaryContactId: number | null;
  primaryContact: ApiGen_Concepts_Person | null;
  purpose: string | null;
}
