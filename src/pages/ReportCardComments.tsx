
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';

const ReportCardComments = () => {
  const handleCommentGeneration = async (content: string, additionalData?: Record<string, string>) => {
    const student = additionalData?.student || 'Student';
    const subject = additionalData?.subject || 'General';
    return await fireworksService.generateReportCardComments(student, subject, content);
  };

  return (
    <AIFeature
      title="Report Card Comments"
      description="Generate professional, constructive report card comments"
      onSubmit={handleCommentGeneration}
      additionalFields={[
        {
          key: 'student',
          label: 'Student Name',
          type: 'text',
          placeholder: 'Enter student name...'
        },
        {
          key: 'subject',
          label: 'Subject',
          type: 'text',
          placeholder: 'Enter subject area...'
        }
      ]}
      placeholder="Describe the student's performance, behavior, and areas of strength/improvement..."
    />
  );
};

export default ReportCardComments;
