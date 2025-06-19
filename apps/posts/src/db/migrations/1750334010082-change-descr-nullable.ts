import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDescrNullable1750334010082 implements MigrationInterface {
    name = 'ChangeDescrNullable1750334010082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "fileName"
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "fileName" character varying(100) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "description" DROP NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "posts"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "files" DROP COLUMN "fileName"
        `);
        await queryRunner.query(`
            ALTER TABLE "files"
            ADD "fileName" character varying(50) NOT NULL
        `);
    }

}
