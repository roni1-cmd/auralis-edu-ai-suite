
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';

const RubricGenerator = () => {
  const handleRubricGeneration = async (content: string, additionalData?: Record<string, string>) => {
    const criteria = additionalData?.criteria || '';
    return await fireworksService.generateRubric(content, criteria);
  };

  return (
    <AIFeature
      title="Rubric Generator"
      description="Create detailed, professional rubrics for assignments and assessments"
      onSubmit={handleRubricGeneration}
      additionalFields={[
        {
          key: 'criteria',
          label: 'Assessment Criteria',
          type: 'textarea',
          placeholder: 'Specify key criteria and skills to be assessed...'
        }
      ]}
      placeholder="Describe the assignment or project that needs a rubric..."
    />
  );
};

export default RubricGenerator;
