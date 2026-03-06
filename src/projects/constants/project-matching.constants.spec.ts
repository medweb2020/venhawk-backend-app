import { textContainsSystemKeyword } from './project-matching.constants';

describe('project matching constants', () => {
  describe('textContainsSystemKeyword', () => {
    it('does not match multi-word phrases by only the first token', () => {
      expect(textContainsSystemKeyword('Power Apps, Azure', 'power bi')).toBe(
        false,
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

    it('still matches single-token keywords exactly', () => {
      expect(textContainsSystemKeyword('Azure, Power Platform', 'azure')).toBe(
        true,
      );
    });
  });
});
