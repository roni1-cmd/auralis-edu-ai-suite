const MISTRAL_API_KEY = "t5hp7sTsKcKAwZycLxCUVtOKELwyedIk";
const MISTRAL_MODEL = "mistral-large-latest";

export interface AIResponse {
  content: string;
  timestamp: Date;
  feature: string;
  input: string;
}

class FireworksService {
  private async makeRequest(prompt: string, feature: string): Promise<string> {
    try {
      console.log('Making Mistral API request:', { prompt: prompt.substring(0, 100) + '...', feature });
      
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4000,
          temperature: 0.7,
        }),
      });

      console.log('Mistral API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Mistral API error response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Mistral API response data:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('Mistral API error:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to generate AI response: ${error.message}`);
      }
      throw new Error('Failed to generate AI response. Please try again.');
    }
  }

  async automaticGrading(content: string, criteria: string): Promise<string> {
    const prompt = `As an expert teacher, grade the following student work based on the criteria provided. Provide a detailed analysis with scores, feedback, and suggestions for improvement.

Grading Criteria: ${criteria}

Student Work:
${content}

Please provide:
1. Overall Grade (percentage or letter grade)
2. Detailed feedback for each criterion
3. Strengths identified
4. Areas for improvement
5. Specific suggestions for enhancement`;

    return this.makeRequest(prompt, 'Automatic Grading');
  }

  async summarizeArticle(content: string): Promise<string> {
    const prompt = `Please provide a comprehensive summary of the following article. Include:
1. Main points and key ideas
2. Supporting arguments or evidence
3. Conclusion or implications
4. Important details that shouldn't be missed

Article:
${content}`;

    return this.makeRequest(prompt, 'Summarize Articles');
  }

  async plagiarismCheck(content: string): Promise<string> {
    const prompt = `Analyze the following text for potential plagiarism indicators. Look for:
1. Unusual style changes or inconsistencies
2. Overly sophisticated language for the context
3. Lack of proper citations
4. Generic or template-like content
5. Provide recommendations for verification

Text to analyze:
${content}

Please provide a detailed analysis with specific concerns and recommendations.`;

    return this.makeRequest(prompt, 'Plagiarism Check');
  }

  async iepAwareRewrite(content: string, accommodations: string): Promise<string> {
    const prompt = `Rewrite the following content to be appropriate for a student with IEP accommodations. Make it accessible while maintaining educational value.

IEP Accommodations to consider: ${accommodations}

Original Content:
${content}

Please provide:
1. Rewritten content with appropriate modifications
2. Explanation of changes made
3. Additional support strategies
4. Assessment adaptations if needed`;

    return this.makeRequest(prompt, 'IEP-Aware Rewrite');
  }

  async generateRubric(assignment: string, criteria: string): Promise<string> {
    const prompt = `Create a detailed rubric for the following assignment. Include multiple performance levels and clear criteria.

Assignment: ${assignment}

Key Criteria to include: ${criteria}

Please create a rubric with:
1. 4-5 performance levels (Excellent, Good, Satisfactory, Needs Improvement, etc.)
2. Clear descriptors for each level
3. Point values or percentage weights
4. Specific, measurable criteria`;

    return this.makeRequest(prompt, 'Rubric Generator');
  }

  async generateReportCardComments(student: string, subject: string, performance: string): Promise<string> {
    const prompt = `Generate professional, constructive report card comments for a student.

Student: ${student}
Subject: ${subject}
Performance Overview: ${performance}

Please provide:
1. Positive comments highlighting strengths
2. Areas for growth and improvement
3. Specific suggestions for continued success
4. Encouraging and professional tone appropriate for parents`;

    return this.makeRequest(prompt, 'Report Card Comments');
  }

  async analyzeCurriculum(curriculum: string, standards: string): Promise<string> {
    const prompt = `Analyze the following curriculum content against educational standards and best practices.

Curriculum Content: ${curriculum}

Standards to evaluate against: ${standards}

Please provide:
1. Alignment analysis with standards
2. Strengths and gaps identified
3. Suggestions for improvement
4. Missing components or topics
5. Recommended enhancements`;

    return this.makeRequest(prompt, 'Curriculum Analyzer');
  }

  async generateLessonPlan(topic: string, grade: string, objectives: string): Promise<string> {
    const prompt = `Create a comprehensive lesson plan for the specified topic and grade level.

Topic: ${topic}
Grade Level: ${grade}
Learning Objectives: ${objectives}

Please include:
1. Lesson overview and duration
2. Materials needed
3. Step-by-step activities
4. Assessment methods
5. Differentiation strategies
6. Extension activities
7. Homework/follow-up assignments`;

    return this.makeRequest(prompt, 'Lesson Plan Generator');
  }
}

export const fireworksService = new FireworksService();
