import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserid1755254955393 implements MigrationInterface {
    name = 'AddUserid1755254955393'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "userId" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "userId"
        `);
    }

}
