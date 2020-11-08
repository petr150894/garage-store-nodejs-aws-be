export class Product {
  constructor(initializer: Partial<Product>) {
    this.id = initializer.id;
    this.title = initializer.title;
    this.description = initializer.description;
    this.imageUrl = initializer.imageUrl;
    this.price = initializer.price ?? 0.0;
    this.count = initializer.count ?? 0;
  }

  public id: string;
  public title: string;
  public description: string;
  public price: number;
  public imageUrl: string;
  public count: number;
}