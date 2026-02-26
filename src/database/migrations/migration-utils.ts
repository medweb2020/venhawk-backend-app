import {
  QueryRunner,
  TableColumn,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export async function addColumnIfMissing(
  queryRunner: QueryRunner,
  tableName: string,
  column: TableColumn,
): Promise<void> {
  const hasColumn = await queryRunner.hasColumn(tableName, column.name);
  if (!hasColumn) {
    await queryRunner.addColumn(tableName, column);
  }
}

export async function dropColumnIfExists(
  queryRunner: QueryRunner,
  tableName: string,
  columnName: string,
): Promise<void> {
  const hasColumn = await queryRunner.hasColumn(tableName, columnName);
  if (hasColumn) {
    await queryRunner.dropColumn(tableName, columnName);
  }
}

function normalizeIdentifier(value: string): string {
  return value.replace(/[`"'"]/g, '').trim().toLowerCase();
}

function normalizeTableName(value: string): string {
  const cleaned = normalizeIdentifier(value);
  const segments = cleaned.split('.');
  return segments[segments.length - 1];
}

function sameColumnSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((column, index) => {
    return normalizeIdentifier(column) === normalizeIdentifier(b[index]);
  });
}

export async function assertColumnsExist(
  queryRunner: QueryRunner,
  tableName: string,
  requiredColumns: string[],
): Promise<void> {
  const missing: string[] = [];

  for (const columnName of requiredColumns) {
    const exists = await queryRunner.hasColumn(tableName, columnName);
    if (!exists) {
      missing.push(columnName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Table "${tableName}" is missing required columns: ${missing.join(', ')}`,
    );
  }
}

export async function ensureIndexByColumns(
  queryRunner: QueryRunner,
  tableName: string,
  index: TableIndex,
): Promise<void> {
  const table = await queryRunner.getTable(tableName);
  if (!table) {
    throw new Error(`Table "${tableName}" not found`);
  }

  const exists = table.indices.some((existingIndex) => {
    const sameColumns = sameColumnSet(
      existingIndex.columnNames,
      index.columnNames,
    );
    if (!sameColumns) {
      return false;
    }

    if (index.isUnique) {
      return existingIndex.isUnique;
    }

    return true;
  });

  if (!exists) {
    await queryRunner.createIndex(tableName, index);
  }
}

export async function ensureUniqueByColumns(
  queryRunner: QueryRunner,
  tableName: string,
  uniqueName: string,
  columnNames: string[],
): Promise<void> {
  await ensureIndexByColumns(
    queryRunner,
    tableName,
    new TableIndex({
      name: uniqueName,
      columnNames,
      isUnique: true,
    }),
  );
}

export async function ensureForeignKey(
  queryRunner: QueryRunner,
  tableName: string,
  foreignKey: TableForeignKey,
): Promise<void> {
  const table = await queryRunner.getTable(tableName);
  if (!table) {
    throw new Error(`Table "${tableName}" not found`);
  }

  const expectedRefTable = normalizeTableName(foreignKey.referencedTableName);
  const exists = table.foreignKeys.some((existingForeignKey) => {
    return (
      sameColumnSet(existingForeignKey.columnNames, foreignKey.columnNames) &&
      normalizeTableName(existingForeignKey.referencedTableName) ===
        expectedRefTable &&
      sameColumnSet(
        existingForeignKey.referencedColumnNames,
        foreignKey.referencedColumnNames,
      )
    );
  });

  if (!exists) {
    await queryRunner.createForeignKey(tableName, foreignKey);
  }
}
