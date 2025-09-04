import { MigrationInterface, QueryRunner } from "typeorm";

export class BusinessRefactor1756896532343 implements MigrationInterface {
    name = 'BusinessRefactor1756896532343'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP CONSTRAINT "FK_2017d0cbfdbfec6b1b388e6aa08"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments" DROP COLUMN "subscriptionType"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payments_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP COLUMN "subscribeId"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD "subscriptionId" character varying NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_subscriptiontype_enum" AS ENUM('1', '7', '30')
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD "subscriptionType" "public"."subscriptions_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_paymenttype_enum" AS ENUM('paypal', 'stripe')
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD "paymentType" "public"."subscriptions_paymenttype_enum" NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "paymentId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."subscriptions_status_enum"
            RENAME TO "subscriptions_status_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_status_enum" AS ENUM(
                'ACTIVE',
                'CANCELED',
                'INACTIVE',
                'APPROVAL_PENDING'
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "status" TYPE "public"."subscriptions_status_enum" USING "status"::"text"::"public"."subscriptions_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_status_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "startAt" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "expiresAt" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD CONSTRAINT "FK_2017d0cbfdbfec6b1b388e6aa08" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments" DROP CONSTRAINT "FK_2017d0cbfdbfec6b1b388e6aa08"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "expiresAt"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "startAt"
            SET NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_status_enum_old" AS ENUM('ACTIVE', 'CANCELED', 'INACTIVE')
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "status" TYPE "public"."subscriptions_status_enum_old" USING "status"::"text"::"public"."subscriptions_status_enum_old"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_status_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."subscriptions_status_enum_old"
            RENAME TO "subscriptions_status_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ALTER COLUMN "paymentId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP COLUMN "paymentType"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_paymenttype_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP COLUMN "subscriptionType"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions" DROP COLUMN "subscriptionId"
        `);
        await queryRunner.query(`
            ALTER TABLE "subscriptions"
            ADD "subscribeId" character varying NOT NULL
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payments_subscriptiontype_enum" AS ENUM('1', '7', '30', '365')
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD "subscriptionType" "public"."payments_subscriptiontype_enum" NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ADD CONSTRAINT "FK_2017d0cbfdbfec6b1b388e6aa08" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
