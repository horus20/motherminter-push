import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdateCompanyAddUID1581089902166 implements MigrationInterface {
    name = 'UpdateCompanyAddUID1581089902166'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `company` ADD `uid` varchar(10) NOT NULL", undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query("ALTER TABLE `company` DROP COLUMN `uid`", undefined);
    }

}
