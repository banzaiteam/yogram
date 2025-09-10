import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentAddDates1757491339022 implements MigrationInterface {
    name = 'PaymentAddDates1757491339022'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "createdAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "updatedAt" date NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "deletedAt" date
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "deletedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "updatedAt"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "createdAt"
        `);
    }

}
