import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostsDeleteOutbox1750860403077 implements MigrationInterface {
    name = 'AddPostsDeleteOutbox1750860403077'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "createdAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "updatedAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "deletedAt" date
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "createdAt"
        `);
    }

}
