import { ExamSimulatorConfig } from '../types';

export const CBSE_MOCK_EXAMS: ExamSimulatorConfig[] = [
  {
    id: 'cbse-math-sprint-1',
    title: 'Mathematics Standard (041) — CBSE Pattern Practice Mock',
    subjectId: 'mathematics',
    totalMarks: 20,
    durationMinutes: 30, // 30-min concentrated sprint simulator
    sections: [
      {
        id: 'sec-a',
        title: 'Section A (Objective & Assertion-Reason)',
        description: 'Questions carry 1 mark each. Choose the most appropriate option based on mathematical logic.',
        marksPerQuestion: 1,
        questionIds: ['math-q1']
      },
      {
        id: 'sec-c',
        title: 'Section C (Short Answer II)',
        description: 'Question carries 3 marks. State geometric reasons and theorem names explicitly.',
        marksPerQuestion: 3,
        questionIds: ['math-q3']
      },
      {
        id: 'sec-d',
        title: 'Section D (Long Problem Solving)',
        description: 'Question carries 4 marks. Explicitly define variables, show steps, and reject extraneous roots with reasons.',
        marksPerQuestion: 4,
        questionIds: ['math-q2']
      }
    ]
  },
  {
    id: 'cbse-science-board-1',
    title: 'Science (086) — CBSE Pattern Practice Mock',
    subjectId: 'science',
    totalMarks: 25,
    durationMinutes: 35,
    sections: [
      {
        id: 'sec-b',
        title: 'Section B (Short Answer I)',
        description: 'Question carries 2 marks. Identify redox participants with full chemical formulas.',
        marksPerQuestion: 2,
        questionIds: ['sci-q3']
      },
      {
        id: 'sec-c',
        title: 'Section C (Numerical & Ray Analysis)',
        description: 'Question carries 3 marks. State mirror formula and adhere strictly to Cartesian Sign Convention.',
        marksPerQuestion: 3,
        questionIds: ['sci-q2']
      },
      {
        id: 'sec-e',
        title: 'Section E (Case-Based Integrated)',
        description: 'Question carries 4 marks with internal sub-parts (i) to (iv). Include proper SI units.',
        marksPerQuestion: 4,
        questionIds: ['sci-q1']
      }
    ]
  },
  {
    id: 'cbse-sst-board-1',
    title: 'Social Science (087) — CBSE Pattern Practice Mock',
    subjectId: 'social-science',
    totalMarks: 20,
    durationMinutes: 30,
    sections: [
      {
        id: 'sec-c',
        title: 'Section C (Short Answer)',
        description: 'Question carries 3 marks. Give distinct comparative definitions with verified democratic examples.',
        marksPerQuestion: 3,
        questionIds: ['sst-q2']
      },
      {
        id: 'sec-d',
        title: 'Section D (Long Answer Analysis)',
        description: 'Question carries 5 marks. Provide 5 distinct structured points with bold sub-headings.',
        marksPerQuestion: 5,
        questionIds: ['sst-q1']
      }
    ]
  },
  {
    id: 'cbse-english-board-1',
    title: 'English (Language & Literature 184) — CBSE Pattern Practice Mock',
    subjectId: 'english',
    totalMarks: 20,
    durationMinutes: 30,
    sections: [
      {
        id: 'sec-c',
        title: 'Section C (Literature Short Answer)',
        description: 'Question carries 3 marks. Answer within 30-40 words highlighting irony and character motivation.',
        marksPerQuestion: 3,
        questionIds: ['eng-q1']
      },
      {
        id: 'sec-b',
        title: 'Section B (Analytical Paragraph Writing)',
        description: 'Question carries 5 marks. Draft an objective 100-120 word comparative analytical summary.',
        marksPerQuestion: 5,
        questionIds: ['eng-q2']
      }
    ]
  },
  {
    id: 'cbse-hindi-board-1',
    title: 'Hindi Course A / B (002 / 085) — CBSE Pattern Practice Mock',
    subjectId: 'hindi',
    totalMarks: 15,
    durationMinutes: 25,
    sections: [
      {
        id: 'sec-a',
        title: 'खंड क (व्याकरण - वाक्य भेद)',
        description: 'प्रश्न 1 अंक का है। रचना के आधार पर सही मिश्र वाक्य विकल्प का चयन कीजिए।',
        marksPerQuestion: 1,
        questionIds: ['hin-q1']
      },
      {
        id: 'sec-b',
        title: 'खंड ख (पाठ्यपुस्तक गद्य खंड)',
        description: 'प्रश्न 2 अंक का है। 25-30 शब्दों में कैप्टन की देशभक्ति और भावना का विश्लेषण कीजिए।',
        marksPerQuestion: 2,
        questionIds: ['hin-q2']
      }
    ]
  }
];
