import { Formik } from 'formik';
import { createMemoryHistory } from 'history';
import noop from 'lodash/noop';

import { mockApiProperty } from '@/mocks/filterData.mock';
import { getEmptyPropertyLease } from '@/mocks/properties.mock';
import { ApiGen_Concepts_Lease } from '@/models/api/generated/ApiGen_Concepts_Lease';
import { getEmptyLease } from '@/models/defaultInitializers';
import { toTypeCode } from '@/utils/formUtils';
import { render, RenderOptions } from '@/utils/test-utils';

import { DetailFeeDetermination, IDetailFeeDeterminationProps } from './DetailFeeDetermination';

const history = createMemoryHistory();

describe('DetailFeeDetermination component', () => {
  const setup = (
    renderOptions: RenderOptions &
      IDetailFeeDeterminationProps & { lease?: ApiGen_Concepts_Lease } = {},
  ) => {
    // render component under test
    const component = render(
      <Formik onSubmit={noop} initialValues={renderOptions.lease ?? getEmptyLease()}>
        <DetailFeeDetermination
          disabled={renderOptions.disabled}
          nameSpace={renderOptions.nameSpace}
        />
      </Formik>,
      {
        ...renderOptions,
        history,
      },
    );

    return {
      component,
    };
  };
  it('renders minimally as expected', () => {
    const { component } = setup({
      lease: {
        ...getEmptyLease(),
      },
    });
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('renders a complete lease as expected', () => {
    const { component } = setup({
      lease: {
        ...getEmptyLease(),
        startDate: '2020-01-01',
        lFileNo: '222',
        motiName: 'test moti name',
        isPublicBenefit: true,
        isFinancialGain: false,
        feeDeterminationNote: 'fee determination test note',
      },
    });
    expect(component.asFragment()).toMatchSnapshot();
  });

  it('renders the suggested Fee field with nominal calculation', () => {
    const {
      component: { getByText },
    } = setup({
      lease: {
        ...getEmptyLease(),
        isPublicBenefit: true,
        isFinancialGain: false,
      },
    });
    expect(getByText('$1 - Nominal')).toBeVisible();
  });

  it('renders the suggested Fee field with LAF calculation', () => {
    const {
      component: { getByText },
    } = setup({
      lease: {
        ...getEmptyLease(),
        isPublicBenefit: true,
        isFinancialGain: true,
      },
    });
    expect(getByText('Licence Administration Fee (LAF) *')).toBeVisible();
  });

  it('renders the suggested Fee field with FMV calculation', () => {
    const {
      component: { getByText },
    } = setup({
      lease: {
        ...getEmptyLease(),
        isPublicBenefit: false,
        isFinancialGain: true,
      },
    });
    expect(getByText('Fair Market Value (FMV) - (Licence Administration Fee Minimum)')).toBeVisible();
  });

  it('renders the suggested Fee field with non-defined calculation', () => {
    const {
      component: { getByText },
    } = setup({
      lease: {
        ...getEmptyLease(),
        isPublicBenefit: false,
        isFinancialGain: false,
      },
    });
    expect(getByText('$1 / Fair Market Value / Licence Administration Fee')).toBeVisible();
  });

  it('renders the suggested Fee field with unknown calculation', async () => {
    const {
      component: { container },
    } = setup({
      lease: {
        ...getEmptyLease(),
        isPublicBenefit: null,
        isFinancialGain: null,
      },
    });
    let suggestedFeeField = await container.querySelector("span[data-testid='suggestedFee']");

    expect(suggestedFeeField).toHaveTextContent('Unknown');
  });
});