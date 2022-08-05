import { NotFoundException } from '@nestjs/common';
import { FindOneOptions, ObjectID, ObjectLiteral, Repository } from 'typeorm';

interface WithId {
  id: number | string;
}

export class BaseRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  async findByIdOrFail(
    id: string | number | Date | ObjectID,
    options?: FindOneOptions<Entity>,
  ): Promise<Entity> {
    const value = await this.findOne(id, options);
    if (!value) {
      throw new NotFoundException(
        `Could not find any matching record: ${id} for entity of type ${this.metadata.name}`,
        `${this.metadata.name.toUpperCase()}_NOT_FOUND`,
      );
    }
    return value;
  }

  /**
   * Reload an entity from the database
   * @param entity
   *
   * @ref https://github.com/typeorm/typeorm/issues/2069#issuecomment-386348206
   */
  public reload(entity: Entity & WithId): Promise<Entity> {
    return this.findOneOrFail(entity.id);
  }
}
