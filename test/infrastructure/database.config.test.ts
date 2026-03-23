import { describe, it, expect } from 'vitest';
import { createNestTypeOrmOptions } from 'src/infrastructure/database/database.config';

describe('createNestTypeOrmOptions', () => {
  it('should have synchronize: false to prevent accidental schema changes in production', () => {
    const options = createNestTypeOrmOptions('postgres://user:pass@localhost/test');
    expect(options.synchronize).toBe(false);
  });
});
