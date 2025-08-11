import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBusinessPayment1754931334454 implements MigrationInterface {
    name = 'AddBusinessPayment1754931334454'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."payments_paymenttype_enum" AS ENUM('paypal', 'stripe')
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payments_subscriptiontype_enum" AS ENUM('1', '7', '30')
        `);
        await queryRunner.query(`
            CREATE TABLE "payments" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "paymentType" "public"."payments_paymenttype_enum" NOT NULL DEFAULT 'paypal',
                "price" integer NOT NULL,
                "subscriptionType" "public"."payments_subscriptiontype_enum" NOT NULL DEFAULT '1',
                "paymentDate" date NOT NULL,
                "expiresAt" date NOT NULL,
                CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "payments"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payments_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payments_paymenttype_enum"
        `);
    }

}
