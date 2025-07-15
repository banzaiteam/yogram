import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComments11752227051992 implements MigrationInterface {
    name = 'AddComments11752227051992'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_d6f93329801a93536da4241e386"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP COLUMN "parent_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD "parentId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD "parentCommentId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ALTER COLUMN "postId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_4875672591221a61ace66f2d4f9"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ALTER COLUMN "postId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP COLUMN "parentCommentId"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP COLUMN "parentId"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD "parent_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_d6f93329801a93536da4241e386" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
