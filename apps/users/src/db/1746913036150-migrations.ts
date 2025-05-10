import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746913036150 implements MigrationInterface {
    name = 'Migrations1746913036150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP COLUMN "userId"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ALTER COLUMN "user_id"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ALTER COLUMN "user_id" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "profiles"
            ADD "userId" uuid NOT NULL
        `);
    }

}
