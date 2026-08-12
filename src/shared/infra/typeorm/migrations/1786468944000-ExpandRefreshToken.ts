import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class ExpandRefreshToken1786468944000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      MODIFY token VARCHAR(1024) CHARACTER SET ascii COLLATE ascii_bin NOT NULL
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE refresh_tokens
      MODIFY token CHAR(64) NOT NULL
    `)
  }
}
