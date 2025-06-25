import { MigrationInterface, QueryRunner } from "typeorm";

export class DelPostsDeleteOutboxEntityid1750863307469 implements MigrationInterface {
    name = 'DelPostsDeleteOutboxEntityid1750863307469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox" DROP COLUMN "entityId"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts-delete-outbox"
            ADD "entityId" uuid NOT NULL
        `);
    }

}
