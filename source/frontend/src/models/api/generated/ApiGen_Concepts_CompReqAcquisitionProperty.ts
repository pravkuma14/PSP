/**
 * File autogenerated by TsGenerator.
 * Do not manually modify, changes made to this file will be lost when this file is regenerated.
 */
import { ApiGen_Base_BaseAudit } from './ApiGen_Base_BaseAudit';
import { ApiGen_Concepts_AcquisitionFileProperty } from './ApiGen_Concepts_AcquisitionFileProperty';

// LINK: @backend/apimodels/Models/Concepts/CompensationRequisition/CompReqAcquisitionPropertyModel.cs
export interface ApiGen_Concepts_CompReqAcquisitionProperty extends ApiGen_Base_BaseAudit {
  compensationRequisitionPropertyId: number | null;
  compensationRequisitionId: number | null;
  propertyAcquisitionFileId: number;
  acquisitionFileProperty: ApiGen_Concepts_AcquisitionFileProperty | null;
}