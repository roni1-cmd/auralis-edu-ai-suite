
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';

const LessonPlanGenerator = () => {
  const handleLessonPlanGeneration = async (content: string, additionalData?: Record<string, string>) => {
    const grade = additionalData?.grade || 'Elementary';
    const objectives = additionalData?.objectives || '';
    return await fireworksService.generateLessonPlan(content, grade, objectives);
  };

  return (
    <AIFeature
      title="Lesson Plan Generator"
      description="Create comprehensive, engaging lesson plans with activities and assessments"
      onSubmit={handleLessonPlanGeneration}
      additionalFields={[
        {
          key: 'grade',
          label: 'Grade Level',
          type: 'text',
          placeholder: 'Enter grade level (e.g., 3rd Grade, High School)...'
        },
        {
          key: 'objectives',
          label: 'Learning Objectives',
          type: 'textarea',
          placeholder: 'List the learning objectives and goals for this lesson...'
        }
      ]}
      placeholder="Enter the topic or subject for the lesson plan..."
    />
  );
};

export default LessonPlanGenerator;
