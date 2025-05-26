import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748290669916 implements MigrationInterface {
    name = 'Migrations1748290669916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "providers" DROP COLUMN "providerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "providers"
            ADD "providerId" bigint
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "providers" DROP COLUMN "providerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "providers"
            ADD "providerId" integer
        `);
    }

}
