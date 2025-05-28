import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsProd1748473646221 implements MigrationInterface {
    name = 'MigrationsProd1748473646221'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "providers" DROP COLUMN "providerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "providers"
            ADD "providerId" character varying
        `);
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
        await queryRunner.query(`
            ALTER TABLE "providers" DROP COLUMN "providerId"
        `);
        await queryRunner.query(`
            ALTER TABLE "providers"
            ADD "providerId" integer
        `);
    }

}
