import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComments1752152515800 implements MigrationInterface {
    name = 'AddComments1752152515800'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "comments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "postId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "text" character varying(300) NOT NULL,
                "likes" integer NOT NULL DEFAULT '0',
                "parent_id" uuid,
                CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "comments"
            ADD CONSTRAINT "FK_d6f93329801a93536da4241e386" FOREIGN KEY ("parent_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "comments" DROP CONSTRAINT "FK_d6f93329801a93536da4241e386"
        `);
        await queryRunner.query(`
            DROP TABLE "comments"
        `);
    }

}
