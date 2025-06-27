import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostPostid21751023365935 implements MigrationInterface {
    name = 'AddPostPostid21751023365935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts" DROP COLUMN "postid"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
            ADD "postid" uuid
        `);
    }

}
