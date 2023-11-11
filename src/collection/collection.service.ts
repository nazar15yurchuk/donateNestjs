import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICollection } from '../interfaces';
import { CollectionDto } from './dto';
import { IManager } from '../interfaces';
import { ERole } from '../common/enums';
import { UpdateCollectionDto } from './dto';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<ICollection>,
  ) {}

  async createCollection(
    user: IManager,
    body: CollectionDto,
    _manager_id: Types.ObjectId,
  ): Promise<ICollection> {
    if (user.role === ERole.manager) {
      return await this.collectionModel.create({ ...body, _manager_id });
    } else {
      throw new HttpException(
        'You don`t have permissions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateCollection(
    user: IManager,
    body: UpdateCollectionDto,
    collectionId: string,
  ): Promise<string> {
    if (user.role === ERole.admin) {
      await this.collectionModel.updateOne({ _id: collectionId }, body);
      return `Status is ${body.status}`;
    } else {
      throw new HttpException(
        { message: 'You are not admin' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllCollections(): Promise<ICollection[]> {
    return this.collectionModel.find();
  }

  async getCollectionById(collectionId: string): Promise<ICollection> {
    const collection = await this.collectionModel.findOne({
      _id: collectionId,
    });
    const views = collection.amountOfViews;
    const raiseViews = views + 1;
    await this.collectionModel.updateOne(
      { _id: collectionId },
      { amountOfViews: raiseViews },
    );
    return this.collectionModel.findOne({ _id: collectionId });
  }
}
