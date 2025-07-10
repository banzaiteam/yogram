import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostPostid11751023194066 implements MigrationInterface {
    name = 'AddPostPostid11751023194066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
                RENAME COLUMN "postId" TO "postid"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
                RENAME COLUMN "postid" TO "postId"
        `);
    }

}
