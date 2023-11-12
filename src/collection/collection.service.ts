import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ICollection, IManager } from '../interfaces';
import { CollectionDto, UpdateCollectionDto } from './dto';
import { ERole, EStatus } from '../common/enums';
import * as mongoose from 'mongoose';
import { log } from 'util';

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
    file: Express.Multer.File,
  ): Promise<ICollection> {
    if (user.role === ERole.manager) {
      console.log(body);
      return await this.collectionModel.create({
        ...body,
        _manager_id,
        image: file ? file.filename : undefined,
      });
    } else {
      throw new HttpException(
        'You don`t have permissions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async get(): Promise<ICollection[]>{
    return this.collectionModel.find();
  }

  async updateCollection(
    user: IManager,
    body: UpdateCollectionDto,
    collectionId: string,
  ): Promise<string> {
    if (user.role === ERole.admin) {
      if (body.status === 'rejected') {
        await this.collectionModel.deleteOne({ _id: collectionId });
        return `Status is ${body.status}, the collection was deleted`;
      }
      await this.collectionModel.updateOne({ _id: collectionId }, body);
      return `Status is ${body.status}`;
    } else {
      throw new HttpException(
        { message: 'You are not admin' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllCollections(page: number, limit: number): Promise<ICollection[]> {
    const skip = (page - 1) * limit;
    return this.collectionModel.find().skip(skip).limit(limit).exec();
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

  // async getMyCollections(user: IManager): Promise<ICollection[]> {
  //   // return this.collectionModel.find({
  //   //   _manager_id: new mongoose.Types.ObjectId(user._id),
  //   // });
  //   const managerObjectId = new mongoose.Types.ObjectId(user._id as string);
  //
  //   try {
  //     return await this.collectionModel.find({ _manager_id: managerObjectId });
  //   } catch (error) {
  //     console.error('Error during query:', error);
  //     throw error; // You might want to handle or log the error appropriately
  //   }
  // }

  // async getFilteredCollections(): Promise<ICollection[]> {
  //   return await this.collectionModel
  //     .find({
  //       status: { $in: ['rejected', 'published'] }, // Use $in to match multiple values
  //     })
  //     .exec();
  // }

  async filteredStatus(status: EStatus): Promise<ICollection[]> {
    return this.collectionModel.find({ status: status });
  }

  // async filteredDate(startDate: string, endDate: string): Promise<ICollection[]> {
  //   return this.collectionModel
  //     .find({
  //       createdAt: {
  //         $gte: startDate,
  //         $lte: endDate,
  //       },
  //     })
  //     .exec();
  // }
}
