
import { AIFeature } from '@/components/AIFeature';
import { fireworksService } from '@/services/fireworks';

const IEPRewrite = () => {
  const handleIEPRewrite = async (content: string, additionalData?: Record<string, string>) => {
    const accommodations = additionalData?.accommodations || '';
    return await fireworksService.iepAwareRewrite(content, accommodations);
  };

  return (
    <AIFeature
      title="IEP-Aware Rewrite"
      description="Adapt content for students with Individual Education Programs (IEP)"
      onSubmit={handleIEPRewrite}
      additionalFields={[
        {
          key: 'accommodations',
          label: 'IEP Accommodations',
          type: 'textarea',
          placeholder: 'List specific IEP accommodations and modifications needed...'
        }
      ]}
      placeholder="Enter the original content that needs to be adapted for IEP students..."
    />
  );
};

export default IEPRewrite;
