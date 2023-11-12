import { IManager } from './manager.interface';

export interface IRequest extends Request {
  user?: IManager;
}
