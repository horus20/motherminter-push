import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCompany1580809080440 implements MigrationInterface {
    name = 'UpdateCompany1580809080440'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `company` ADD `isProtected` tinyint NOT NULL DEFAULT 0", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `company` DROP COLUMN `isProtected`", undefined);
    }

}
