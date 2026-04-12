export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface ICategoryCreate {
  name: string;
  description: string;
}

export interface ICategoryUpdate {
  name?: string;
  description?: string;
}
