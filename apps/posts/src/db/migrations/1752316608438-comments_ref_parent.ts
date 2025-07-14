import { MigrationInterface, QueryRunner } from "typeorm";

export class CommentsRefParent1752316608438 implements MigrationInterface {
    name = 'CommentsRefParent1752316608438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_1b0c4c713e984e4cc0441fa5050"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP COLUMN "postId"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP COLUMN "parent_comment"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD "post_id" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81" FOREIGN KEY ("parentId") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_8770bd9030a3d13c5f79a7d2e81"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_259bf9825d9d198608d1b46b0b5"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments" DROP COLUMN "post_id"
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD "parent_comment" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD "postId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_1b0c4c713e984e4cc0441fa5050" FOREIGN KEY ("parent_comment") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_e44ddaaa6d058cb4092f83ad61f" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
