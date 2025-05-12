import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationsProd1747104925493 implements MigrationInterface {
    name = 'MigrationsProd1747104925493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "country" TO "countrY"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
                RENAME COLUMN "countrY" TO "country"
        `);
    }

}
