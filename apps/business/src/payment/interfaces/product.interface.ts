export interface IProduct {
  name: string;
  description: string;
  type: Type;
  category: Category;
}

type Type = 'service' | 'physical';
type Category = 'software';
