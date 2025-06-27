import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostPostid1751023004727 implements MigrationInterface {
    name = 'AddPostPostid1751023004727'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD "postId" uuid
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts" DROP COLUMN "postId"
        `);
    }

}
