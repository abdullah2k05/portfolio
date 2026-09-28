import { defaultPortfolioContent } from '../data/defaultPortfolioContent';

export function usePortfolioContent() {
  return { content: defaultPortfolioContent, loading: false };
}
