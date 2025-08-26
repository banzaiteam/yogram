import { Currency } from '../../../../../../libs/Business/constants/currency.enum';

export interface IProduct {
  id: string;
  name: string;
  description: string;
  type: ProductType;
}

type ProductType = 'SERVICE';

interface UnitAmount {
  currencyCode: Currency;
  value: string;
}
