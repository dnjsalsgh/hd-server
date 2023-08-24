export interface BasicQueryParamDto {
  createdAtFrom?: Date;
  createdAtTo?: Date;
  order?: string;
  limit?: number;
  offset?: number;
}
