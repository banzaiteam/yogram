import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionEntity1756492007989 implements MigrationInterface {
    name = 'AddSubscriptionEntity1756492007989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD "paymentId" uuid NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP COLUMN "paymentId"
        `);
    }

}
