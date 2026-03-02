import { textContainsSystemKeyword } from './project-matching.constants';

describe('project matching constants', () => {
  describe('textContainsSystemKeyword', () => {
    it('preserves existing primary-keyword behavior', () => {
      expect(textContainsSystemKeyword('Power Apps, Azure', 'power bi')).toBe(
        true,
      );
    });

    it('matches when vendor value removes spaces', () => {
      expect(textContainsSystemKeyword('PowerBI, Azure', 'power bi')).toBe(
        true,
      );
    });

    it('matches when user input removes spaces', () => {
      expect(textContainsSystemKeyword('Power BI, Azure', 'powerbi')).toBe(
        true,
      );
    });

    it('does not match unrelated compact substrings', () => {
      expect(textContainsSystemKeyword('Capital Markets', 'api')).toBe(false);
    });
  });
});
