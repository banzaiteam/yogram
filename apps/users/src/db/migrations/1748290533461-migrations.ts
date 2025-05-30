import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748290533461 implements MigrationInterface {
    name = 'Migrations1748290533461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "password" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ALTER COLUMN "password"
            SET NOT NULL
        `);
    }

}
