import {
  Table,
  TableForeignKey,
  type MigrationInterface,
  type QueryRunner,
} from 'typeorm'

export class CreateRefreshTokens1786212516310 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'refresh_tokens',
        columns: [
          {
            name: 'id',
            type: 'char',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'char',
            length: '36',
            isNullable: false,
          },
          {
            name: 'token',
            type: 'char',
            length: '64',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'expires_at',
            type: 'datetime',
            isNullable: false,
          },
          {
            name: 'revoked_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    )

    await queryRunner.createForeignKey(
      'refresh_tokens',
      new TableForeignKey({
        name: 'FK_refresh_tokens_user',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('refresh_tokens')
  }
}
