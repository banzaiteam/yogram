import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentsParentComment1752261997012 implements MigrationInterface {
    name = 'CommentsParentComment1752261997012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_4875672591221a61ace66f2d4f9"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
                RENAME COLUMN "parentCommentId" TO "parent_comment"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_1b0c4c713e984e4cc0441fa5050" FOREIGN KEY ("parent_comment") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_1b0c4c713e984e4cc0441fa5050"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
                RENAME COLUMN "parent_comment" TO "parentCommentId"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_4875672591221a61ace66f2d4f9" FOREIGN KEY ("parentCommentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
