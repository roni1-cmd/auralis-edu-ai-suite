
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';

const CurriculumAnalyzer = () => {
  const handleCurriculumAnalysis = async (content: string, additionalData?: Record<string, string>) => {
    const standards = additionalData?.standards || 'Common Core Standards';
    return await fireworksService.analyzeCurriculum(content, standards);
  };

  return (
    <AIFeature
      title="Curriculum Analyzer"
      description="Analyze curriculum alignment with educational standards and best practices"
      onSubmit={handleCurriculumAnalysis}
      additionalFields={[
        {
          key: 'standards',
          label: 'Educational Standards',
          type: 'textarea',
          placeholder: 'Specify the educational standards to analyze against...'
        }
      ]}
      placeholder="Enter the curriculum content to be analyzed..."
    />
  );
};

export default CurriculumAnalyzer;
