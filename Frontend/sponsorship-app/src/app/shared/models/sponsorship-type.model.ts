export class SponsorshipTypeModel {
  id: number = 0;
  typeName: string = '';
  description: string = '';
  maxAmount: number = 0;
  isActive: boolean = true;
  createdAt: Date = new Date();
  updateddAt: Date = new Date();

  constructor(data?: Partial<SponsorshipTypeModel>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
