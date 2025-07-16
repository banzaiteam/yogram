import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersAddSubscribers1752671249199 implements MigrationInterface {
    name = 'UsersAddSubscribers1752671249199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "subscriber" (
                "id" uuid NOT NULL,
                CONSTRAINT "PK_1c52b7ddbaf79cd2650045b79c7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "subscribes" (
                "subscriber_id" uuid NOT NULL,
                "subscribed_id" uuid NOT NULL,
                CONSTRAINT "PK_ee421e1e4089465873558e29fa0" PRIMARY KEY ("subscriber_id", "subscribed_id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ca93da33a094ae83342c881f77" ON "subscribes" ("subscriber_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_909900499cf7f93ea656ebb7b5" ON "subscribes" ("subscribed_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "subscribes"
            ADD CONSTRAINT "FK_ca93da33a094ae83342c881f773" FOREIGN KEY ("subscriber_id") REFERENCES "subscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE "subscribes"
            ADD CONSTRAINT "FK_909900499cf7f93ea656ebb7b52" FOREIGN KEY ("subscribed_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscribes" DROP CONSTRAINT "FK_909900499cf7f93ea656ebb7b52"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscribes" DROP CONSTRAINT "FK_ca93da33a094ae83342c881f773"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_909900499cf7f93ea656ebb7b5"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ca93da33a094ae83342c881f77"
        `);
        await queryRunner.query(`
            DROP TABLE "subscribes"
        `);
        await queryRunner.query(`
            DROP TABLE "subscriber"
        `);
    }

}
