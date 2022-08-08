import { EntityRepository } from 'typeorm';
import { Hash } from '../entities/hash.entity';
import { BaseRepository } from './base.repository';

@EntityRepository(Hash)
export class HashRepository extends BaseRepository<Hash> {}
