/**
 * File autogenerated by TsGenerator.
 * Do not manually modify, changes made to this file will be lost when this file is regenerated.
 */
import { ApiGen_Base_BaseConcurrent } from './ApiGen_Base_BaseConcurrent';
import { ApiGen_Base_CodeType } from './ApiGen_Base_CodeType';
import { ApiGen_Concepts_Organization } from './ApiGen_Concepts_Organization';
import { ApiGen_Concepts_Person } from './ApiGen_Concepts_Person';

// LINK: @backend/apimodels/Models/Concepts/DispositionFile/DispositionFileTeamModel.cs
export interface ApiGen_Concepts_DispositionFileTeam extends ApiGen_Base_BaseConcurrent {
  id: number;
  dispositionFileId: number;
  personId: number | null;
  person: ApiGen_Concepts_Person | null;
  organizationId: number | null;
  organization: ApiGen_Concepts_Organization | null;
  primaryContactId: number | null;
  primaryContact: ApiGen_Concepts_Person | null;
  teamProfileTypeCode: string | null;
  teamProfileType: ApiGen_Base_CodeType<string> | null;
}