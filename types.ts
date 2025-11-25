
export interface AchievementStandard {
  id: string;
  text: string;
}

export interface EvaluationData {
  subjects: string[];
  standards: {
    [subject: string]: AchievementStandard[];
  };
}

export interface StandardEvaluation {
  standardId: string;
  achievementLevel: string;
  attitude: string;
  generationFocus: string;
  additionalInfo: string;
}

export interface StudentData {
  id: number;
  subject: string;
  standardEvaluations: StandardEvaluation[];
  comment: string;
  isGenerating: boolean;
  error: string | null;
  isConfirmed: boolean;
}
