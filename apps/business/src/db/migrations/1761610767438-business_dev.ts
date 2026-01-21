import { MigrationInterface, QueryRunner } from "typeorm";

export class BusinessDev1761610767438 implements MigrationInterface {
    name = 'BusinessDev1761610767438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."payments_paymenttype_enum" AS ENUM('paypal', 'stripe')
        `);
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "userId" uuid NOT NULL,
                "paymentType" "public"."payments_paymenttype_enum" NOT NULL,
                "price" integer NOT NULL,
                "subscriptionId" uuid,
                CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_status_enum" AS ENUM(
                'ACTIVE',
                'CANCELED',
                'INACTIVE',
                'SUSPENDED',
                'APPROVAL_PENDING'
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_subscriptiontype_enum" AS ENUM('1', '7', '30')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_paymenttype_enum" AS ENUM('paypal', 'stripe')
        `);
        await queryRunner.query(`
            CREATE TABLE "subscriptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "createdAt" date NOT NULL DEFAULT now(),
                "updatedAt" date NOT NULL DEFAULT now(),
                "deletedAt" date,
                "subscriptionId" character varying NOT NULL,
                "paymentId" uuid,
                "userId" uuid NOT NULL,
                "status" "public"."subscriptions_status_enum" NOT NULL,
                "subscriptionType" "public"."subscriptions_subscriptiontype_enum",
                "paymentType" "public"."subscriptions_paymenttype_enum" NOT NULL,
                "startAt" date,
                "expiresAt" date,
                CONSTRAINT "PK_a87248d73155605cf782be9ee5e" PRIMARY KEY ("id")
            )
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
            DROP TABLE "subscriptions"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_paymenttype_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "payments"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payments_paymenttype_enum"
        `);
    }

}
