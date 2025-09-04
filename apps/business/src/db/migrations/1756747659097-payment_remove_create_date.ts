import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentRemoveCreateDate1756747659097 implements MigrationInterface {
    name = 'PaymentRemoveCreateDate1756747659097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "paymentDate"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "expiresAt"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "expiresAt" date NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "paymentDate" date NOT NULL
        `);
    }

}
