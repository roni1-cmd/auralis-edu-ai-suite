
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';

const SummarizeArticles = () => {
  const handleSummarize = async (content: string) => {
    return await fireworksService.summarizeArticle(content);
  };

  return (
    <AIFeature
      title="Summarize Articles"
      description="Generate comprehensive summaries of educational content and articles"
      onSubmit={handleSummarize}
      placeholder="Paste the article content here for summarization..."
    />
  );
};

export default SummarizeArticles;
