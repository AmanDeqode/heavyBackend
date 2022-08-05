import { MigrationInterface, QueryRunner } from 'typeorm';

export class createTable1622802479553 implements MigrationInterface {
  name = 'createTable1622802479553';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "password" character varying NOT NULL, "status" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum" NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_12ffa5c867f6bb71e2690a526ce" UNIQUE ("email"), CONSTRAINT "PK_a6cc71bedf15a41a5f5ee8aea97" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "public"."user_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token_id" character varying NOT NULL, "expires_in" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "PK_3c61d1a90e3bd82642efb044204" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "public"."user_tokens" ADD CONSTRAINT "FK_7ca2012a51d94b09e2ce045cfcd" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "public"."user_tokens" DROP CONSTRAINT "FK_7ca2012a51d94b09e2ce045cfcd"`,
    );
    await queryRunner.query(`DROP TABLE "public"."user_tokens"`);
    await queryRunner.query(`DROP TABLE "public"."users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
