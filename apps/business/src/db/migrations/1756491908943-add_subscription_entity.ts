import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubscriptionEntity1756491908943 implements MigrationInterface {
    name = 'AddSubscriptionEntity1756491908943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_status_enum" AS ENUM('ACTIVE', 'CANCELED', 'INACTIVE')
        `);
        await queryRunner.query(`
            CREATE TABLE "subscriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "userId" uuid NOT NULL,
                "subscribeId" character varying NOT NULL,
                "status" "public"."subscriptions_status_enum" NOT NULL,
                "expiresAt" date NOT NULL,
                CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "subscriptionId" uuid
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD CONSTRAINT "FK_2017d0cbfdbfec6b1b388e6aa08" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP CONSTRAINT "FK_2017d0cbfdbfec6b1b388e6aa08"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "subscriptionId"
        `);
        await queryRunner.query(`
            DROP TABLE "subscriptions"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_status_enum"
        `);
    }

}
