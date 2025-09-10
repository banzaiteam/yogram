import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentAddDates1757491376705 implements MigrationInterface {
    name = 'PaymentAddDates1757491376705'

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
        await queryRunner.query(`
            ALTER TYPE "public"."subscriptions_status_enum"
            RENAME TO "subscriptions_status_enum_old"
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
            ALTER TABLE "subscriptions"
            ALTER COLUMN "status" TYPE "public"."subscriptions_status_enum" USING "status"::"text"::"public"."subscriptions_status_enum"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."subscriptions_status_enum_old"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."subscriptions_status_enum_old" AS ENUM(
                'ACTIVE',
                'CANCELED',
                'INACTIVE',
                'APPROVAL_PENDING'
            )
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
