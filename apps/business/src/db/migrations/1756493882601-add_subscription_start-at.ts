import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionStartAt1756493882601 implements MigrationInterface {
    name = 'AddSubscriptionStartAt1756493882601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD "startAt" date NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP COLUMN "startAt"
        `);
    }

}
