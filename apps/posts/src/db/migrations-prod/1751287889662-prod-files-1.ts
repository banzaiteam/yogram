import { MigrationInterface, QueryRunner } from "typeorm";

export class ProdFiles11751287889662 implements MigrationInterface {
    name = 'ProdFiles11751287889662'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "status1"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."files_status1_enum"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."files_status1_enum" AS ENUM('pending', 'ready')
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "status1" "public"."files_status1_enum" NOT NULL DEFAULT 'pending'
        `);
    }

}
