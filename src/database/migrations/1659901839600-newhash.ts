import { MigrationInterface, QueryRunner } from 'typeorm';

export class newhash1659901839600 implements MigrationInterface {
  name = 'newhash1659901839600';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."hash_table_status_enum" AS ENUM('pending', 'notfound', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hash_table" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "input_hex" character varying(255), "nonce" bigint DEFAULT '0', "last_process_nonce" bigint DEFAULT '0', "ip_address" character varying(255), "output_hex" character varying(255), "status" "public"."hash_table_status_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fdc8bb3b82c24577c38d9cc5f79" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "hash_table"`);
    await queryRunner.query(`DROP TYPE "public"."hash_table_status_enum"`);
  }
}
