import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { ICollection, IManager } from '../interfaces';
import { CollectionDto, UpdateCollectionDto } from './dto';
import { ERole, EStatus } from '../common';
import { UpdateCollectionByManagerDto } from './dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel('Collection')
    private readonly collectionModel: Model<ICollection>,
  ) {}

  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  });

  async createCollection(
    user: IManager,
    body: CollectionDto,
    _manager_id: Types.ObjectId,
    file: Express.Multer.File,
  ) {
    if (user.role === ERole.manager) {
      console.log(body);
      const { originalname } = file;

      await this.collectionModel.create({
        ...body,
        sum: Number(body.sum),
        _manager_id,
        image: file ? file.filename : undefined,
      });
      return await this.s3_upload(
        file.buffer,
        this.AWS_S3_BUCKET,
        originalname,
        file.mimetype,
      );
    } else {
      throw new HttpException(
        'You don`t have permissions',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async s3_upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: process.env.ACL,
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: process.env.LOCATION_CONSTRAINT,
      },
    };

    try {
      return (await this.s3.upload(params).promise()).Key;
    } catch (e) {
      console.log(e);
    }
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

  async updateCollectionByManager(
    user: IManager,
    body: UpdateCollectionByManagerDto,
    collectionId: string,
  ) {
    if (user.role === ERole.manager) {
      await this.collectionModel.updateOne({ _id: collectionId }, { ...body });
      return this.collectionModel.findOne({ _id: collectionId });
    } else {
      throw new HttpException(
        { message: 'You are not manager' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllCollections(page: number, limit: number): Promise<ICollection[]> {
    const skip = (page - 1) * limit;
    return this.collectionModel
      .find({ status: EStatus.published })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async getAllPendingCollections(page: number, limit: number, user: IManager) {
    if (user.role === ERole.admin) {
      const skip = (page - 1) * limit;
      return await this.collectionModel
        .find({ status: EStatus.pending })
        .skip(skip)
        .limit(limit)
        .exec();
    } else {
      throw new HttpException(
        { message: 'You are not admin' },
        HttpStatus.BAD_REQUEST,
      );
    }
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

  async searchCollections(search: string): Promise<ICollection[]> {
    if (/^[0-9a-fA-F]{24}$/.test(search)) {
      return this.collectionModel
        .find({
          title: { $regex: new RegExp(search, 'i') },
        })
        .exec();
    } else {
      return this.collectionModel.find();
    }
  }

  async filteredStatus(status: EStatus): Promise<ICollection[]> {
    return this.collectionModel.find({ status: status });
  }
}
