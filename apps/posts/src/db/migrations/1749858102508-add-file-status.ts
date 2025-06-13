import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileStatus1749858102508 implements MigrationInterface {
    name = 'AddFileStatus1749858102508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."files_status_enum" AS ENUM('pending', 'ready')
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "status" "public"."files_status_enum" NOT NULL DEFAULT 'pending'
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
            ALTER TABLE "files" DROP COLUMN "status"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."files_status_enum"
        `);
    }

}
