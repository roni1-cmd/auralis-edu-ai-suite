
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';

const PlagiarismCheck = () => {
  const handlePlagiarismCheck = async (content: string) => {
    return await fireworksService.plagiarismCheck(content);
  };

  return (
    <AIFeature
      title="Plagiarism Check"
      description="Detect potential plagiarism with AI-powered analysis"
      onSubmit={handlePlagiarismCheck}
      placeholder="Paste the student's work here to check for potential plagiarism..."
    />
  );
};

export default PlagiarismCheck;
