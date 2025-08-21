import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentEnum3651755808573615 implements MigrationInterface {
    name = 'PaymentEnum3651755808573615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "paymentType" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payments_subscriptiontype_enum"
            RENAME TO "payments_subscriptiontype_enum_old"
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."payments_subscriptiontype_enum" AS ENUM('1', '7', '30', '365')
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "subscriptionType" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "subscriptionType" TYPE "public"."payments_subscriptiontype_enum" USING "subscriptionType"::"text"::"public"."payments_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "subscriptionType"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payments_subscriptiontype_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."payments_subscriptiontype_enum_old" AS ENUM('1', '7', '30')
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "subscriptionType" DROP DEFAULT
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "subscriptionType" TYPE "public"."payments_subscriptiontype_enum_old" USING "subscriptionType"::"text"::"public"."payments_subscriptiontype_enum_old"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "subscriptionType"
            SET DEFAULT '1'
        `);
        await queryRunner.query(`
            DROP TYPE "public"."payments_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            ALTER TYPE "public"."payments_subscriptiontype_enum_old"
            RENAME TO "payments_subscriptiontype_enum"
        `);
        await queryRunner.query(`
            ALTER TABLE "payments"
            ALTER COLUMN "paymentType"
            SET DEFAULT 'paypal'
        `);
    }

}
