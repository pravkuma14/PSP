import moment from 'moment';

import { PayeeOption } from '@/features/mapSideBar/acquisition/models/PayeeOptionModel';
import { useCompensationRequisitionRepository } from '@/hooks/repositories/useRequisitionCompensationRepository';
import {
  mockAcquisitionFileOwnersResponse,
  mockAcquisitionFileResponse,
} from '@/mocks/acquisitionFiles.mock';
import { getMockApiDefaultCompensation } from '@/mocks/compensations.mock';
import { mockLookups } from '@/mocks/lookups.mock';
import { ApiGen_Concepts_FinancialCode } from '@/models/api/generated/ApiGen_Concepts_FinancialCode';
import { ApiGen_Concepts_FinancialCodeTypes } from '@/models/api/generated/ApiGen_Concepts_FinancialCodeTypes';
import { getEmptyBaseAudit } from '@/models/defaultInitializers';
import { lookupCodesSlice } from '@/store/slices/lookupCodes';
import { systemConstantsSlice } from '@/store/slices/systemConstants/systemConstantsSlice';
import { act, render, RenderOptions, waitFor } from '@/utils/test-utils';

import UpdateCompensationRequisitionContainer, {
  UpdateCompensationRequisitionContainerProps,
} from './UpdateCompensationRequisitionContainer';
import { CompensationRequisitionFormProps } from './UpdateCompensationRequisitionForm';
import { CompensationRequisitionFormModel } from '../models/CompensationRequisitionFormModel';
import { ApiGen_CodeTypes_FileTypes } from '@/models/api/generated/ApiGen_CodeTypes_FileTypes';
import { useInterestHolderRepository } from '@/hooks/repositories/useInterestHolderRepository';

vi.mock('@/hooks/repositories/useRequisitionCompensationRepository');
type Provider = typeof useCompensationRequisitionRepository;

const mockUpdateCompensation = vi.fn();
vi.mocked(useCompensationRequisitionRepository).mockReturnValue({
  updateCompensationRequisition: {
    error: undefined,
    response: undefined,
    execute: mockUpdateCompensation,
    loading: false,
  },
} as unknown as ReturnType<Provider>);

vi.mock('@/hooks/repositories/useAcquisitionProvider', () => ({
  useAcquisitionProvider: () => {
    return {
      getAcquisitionOwners: {
        error: undefined,
        response: mockAcquisitionFileOwnersResponse(1),
        execute: vi.fn().mockResolvedValue(mockAcquisitionFileOwnersResponse(1)),
        loading: false,
      },
      getAcquisitionFileSolicitors: {
        execute: vi.fn(),
        loading: false,
      },
      getAcquisitionFileRepresentatives: {
        execute: vi.fn(),
        loading: false,
      },
    };
  },
}));

const getAcqFileInterestHoldersFn = vi.fn();
vi.mock('@/hooks/repositories/useInterestHolderRepository');
vi.mocked(useInterestHolderRepository).mockImplementation(
  () =>
    ({
      getAcquisitionInterestHolders: { execute: getAcqFileInterestHoldersFn },
    } as unknown as ReturnType<typeof useInterestHolderRepository>),
);

const mockGetApi = {
  error: undefined,
  response: [],
  execute: vi.fn(),
  loading: false,
};

vi.mock('@/hooks/repositories/useFinancialCodeRepository', () => ({
  useFinancialCodeRepository: () => {
    return {
      getFinancialActivityCodeTypes: mockGetApi,
      getChartOfAccountsCodeTypes: mockGetApi,
      getResponsibilityCodeTypes: mockGetApi,
      getYearlyFinancialsCodeTypes: mockGetApi,
    };
  },
}));

let viewProps: CompensationRequisitionFormProps | undefined;
const TestView: React.FC<CompensationRequisitionFormProps> = props => {
  viewProps = props;
  return <span>Content Rendered</span>;
};

const mockCompensation = getMockApiDefaultCompensation();
const onSuccess = vi.fn();
const onCancel = vi.fn();

describe('UpdateCompensationRequisition Container component', () => {
  const setup = async (
    renderOptions: RenderOptions & {
      props?: Partial<UpdateCompensationRequisitionContainerProps>;
    } = {},
  ) => {
    const component = render(
      <UpdateCompensationRequisitionContainer
        compensation={renderOptions?.props?.compensation ?? getMockApiDefaultCompensation()}
        fileType={renderOptions?.props?.fileType ?? ApiGen_CodeTypes_FileTypes.Acquisition}
        file={renderOptions?.props?.file ?? mockAcquisitionFileResponse(1)}
        onSuccess={onSuccess}
        onCancel={onCancel}
        View={TestView}
      />,
      {
        store: {
          [lookupCodesSlice.name]: { lookupCodes: mockLookups },
          [systemConstantsSlice.name]: { systemConstants: [{ name: 'GST', value: '5.0' }] },
        },
        useMockAuthentication: true,
        claims: renderOptions?.claims ?? [],
        ...renderOptions,
      },
    );

    return {
      ...component,
    };
  };

  beforeEach(() => {
    viewProps = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the underlying form', async () => {
    const { getByText } = await setup();
    await act(async () => {});
    expect(getByText(/Content Rendered/)).toBeVisible();
  });

  it('calls onSuccess when the compensation is saved successfully', async () => {
    const mockCompensationUpdate = getMockApiDefaultCompensation();
    await setup({
      props: { compensation: mockCompensationUpdate },
    });
    mockUpdateCompensation.mockResolvedValue(mockCompensationUpdate);

    const model = CompensationRequisitionFormModel.fromApi(mockCompensationUpdate);
    model.detailedRemarks = 'Remarks updated value';
    model.fiscalYear = '2022/2023';

    await act(async () => {
      viewProps?.onSave(model);
    });

    expect(mockUpdateCompensation).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('does not call onSuccess if the returned value is invalid', async () => {
    const mockCompensationUpdate = getMockApiDefaultCompensation();
    mockUpdateCompensation.mockResolvedValue(undefined);

    await setup({
      props: { compensation: mockCompensationUpdate },
    });

    const model = CompensationRequisitionFormModel.fromApi(mockCompensationUpdate);
    model.detailedRemarks = 'update';
    await act(async () => {
      await viewProps?.onSave(model);
    });

    expect(mockUpdateCompensation).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('makes request to update the compensation with payees', async () => {
    const mockCompensationUpdate = getMockApiDefaultCompensation(1, null);
    await setup({
      props: {
        compensation: mockCompensationUpdate,
        fileType: ApiGen_CodeTypes_FileTypes.Acquisition,
      },
    });

    // await act(async () => {});

    mockCompensationUpdate.detailedRemarks = 'my update';
    mockUpdateCompensation.mockResolvedValue(mockCompensationUpdate);

    const updatedCompensationModel = new CompensationRequisitionFormModel(
      mockCompensation.id,
      mockCompensation.acquisitionFileId,
      null,
      '',
    );
    updatedCompensationModel.detailedRemarks = 'my update';

    const testPayeeOption: PayeeOption = PayeeOption.createOwner(
      mockAcquisitionFileOwnersResponse(1)[0],
    );

    updatedCompensationModel.payee.payeeKey = testPayeeOption.value;

    await act(async () => {
      viewProps?.onSave(updatedCompensationModel);
    });

    expect(getAcqFileInterestHoldersFn).toHaveBeenCalled();

    // expect(mockUpdateCompensation).toHaveBeenCalledWith(
    //   updatedCompensationModel.toApi([testPayeeOption]),
    // );
  });

  it('filters expired financial codes when updating', async () => {
    const expiredFinancialCodes: ApiGen_Concepts_FinancialCode[] = [
      {
        id: 1,
        type: ApiGen_Concepts_FinancialCodeTypes.Responsibility,
        code: '1',
        description: '1',
        effectiveDate: moment().add(-2, 'days').format('YYYY-MM-DD'),
        expiryDate: moment().add(-1, 'days').format('YYYY-MM-DD'),
        displayOrder: null,
        ...getEmptyBaseAudit(),
      },
      {
        id: 2,
        type: ApiGen_Concepts_FinancialCodeTypes.WorkActivity,
        code: '2',
        description: '2',
        effectiveDate: moment().add(-2, 'days').format('YYYY-MM-DD'),
        expiryDate: moment().add(1, 'days').format('YYYY-MM-DD'),
        displayOrder: null,
        ...getEmptyBaseAudit(),
      },
    ];
    mockGetApi.execute = vi.fn().mockResolvedValue(expiredFinancialCodes);
    await setup();
    await act(async () => {});

    await waitFor(async () => {
      expect(viewProps?.financialActivityOptions).toHaveLength(1);
      expect(viewProps?.chartOfAccountsOptions).toHaveLength(1);
      expect(viewProps?.responsiblityCentreOptions).toHaveLength(1);
      expect(viewProps?.yearlyFinancialOptions).toHaveLength(1);
    });
  });
});
