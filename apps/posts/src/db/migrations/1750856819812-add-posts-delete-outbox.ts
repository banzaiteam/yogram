import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostsDeleteOutbox1750856819812 implements MigrationInterface {
    name = 'AddPostsDeleteOutbox1750856819812'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "entityStatus"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "filesStatus"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "entityDeleted" boolean NOT NULL DEFAULT false
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "filesDeleted" boolean NOT NULL DEFAULT false
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "filesDeleted"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "entityDeleted"
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "filesStatus" boolean NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "entityStatus" boolean NOT NULL
        `);
    }

}
