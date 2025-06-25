import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostsDeleteOutboxDates1750860589983 implements MigrationInterface {
    name = 'AddPostsDeleteOutboxDates1750860589983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "createdAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "deletedAt"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "deletedAt" date
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "updatedAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "createdAt" date NOT NULL DEFAULT now()
        `);
    }

}
