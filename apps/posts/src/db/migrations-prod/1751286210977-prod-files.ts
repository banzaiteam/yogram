import { MigrationInterface, QueryRunner } from "typeorm";

export class ProdFiles1751286210977 implements MigrationInterface {
    name = 'ProdFiles1751286210977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "posts-delete-outbox" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "pathToFiles" character varying NOT NULL,
                "bucketName" character varying NOT NULL,
                "entityDeleted" boolean NOT NULL DEFAULT false,
                "filesDeleted" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_5cbc10116911366c13a671f9f37" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."files_status_enum" AS ENUM('pending', 'ready')
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "status" "public"."files_status_enum" NOT NULL DEFAULT 'pending'
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."files_status1_enum" AS ENUM('pending', 'ready')
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "status1" "public"."files_status1_enum" NOT NULL DEFAULT 'pending'
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "description" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "fileName"
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "fileName" character varying(100) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ALTER COLUMN "url" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "postId"
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "postId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD CONSTRAINT "FK_3d97c727c9f600ceff4ab57cd6d" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "files" DROP CONSTRAINT "FK_3d97c727c9f600ceff4ab57cd6d"
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "postId"
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "postId" character varying
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ALTER COLUMN "url"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "fileName"
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "fileName" character varying(50) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "status1"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."files_status1_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."files_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "posts-delete-outbox"
        `);
    }

}
