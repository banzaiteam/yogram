import { MigrationInterface, QueryRunner } from "typeorm";

export class BusinessAddSuspended1757095893148 implements MigrationInterface {
    name = 'BusinessAddSuspended1757095893148'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "public"."userid_idx"
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
            CREATE INDEX "userid_idx" ON "subscriptions" ("status")
        `);
    }

}
