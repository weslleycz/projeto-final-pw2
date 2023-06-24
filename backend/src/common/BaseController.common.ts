export abstract class BaseController {
  abstract getAll(): Promise<any[]>;

  abstract getById(id: string): Promise<any>;

  abstract create(data: any, headers?: any): Promise<any>;

  abstract update(id: string, data: any): Promise<any>;

  abstract delete(id: string): Promise<string>;
}
