// ====== QUIZ TYPES ======

export interface QuizSettings {
  timeLimit?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  passingScore?: number;
  showCorrectAnswers?: boolean;
}

export interface Quiz {
  qid: string;
  name: string;
  description?: string;
  settings_json?: QuizSettings | string;
  status: 'draft' | 'published' | 'archived';
  available_from?: string | null;
  available_until?: string | null;
  class_id?: string;
  creator_id?: string;
  created_at?: string;
  updated_at?: string;
  class?: {
    clid: string;
    name: string;
    course?: {
      code: string;
      name: string;
    };
    lecturer?: {
      name: string;
    };
  };
  questions?: Question[];
  creator?: {
    lid: string;
    name: string;
  };
  _count?: {
    questions: number;
    attempts: number;
  };
}

export interface Question {
  ques_id?: string;
  content: string;
  options_json?: string;
  answer_key_json: string;
  points?: number;
  quiz_id?: string;
}

// ====== REQUEST TYPES ======

export interface QuestionCreateRequest {
  content: string;
  options_json?: string;
  answer_key_json: string;
  points?: number;
}

export interface QuestionUpdateRequest {
  ques_id?: string; // If provided: UPDATE, if omitted: CREATE
  content: string;
  options_json?: string;
  answer_key_json: string;
  points?: number;
}

export interface QuizCreateRequest {
  name: string;
  description?: string;
  clid: string;
  creator_id: string;
  settings_json?: string;
  status: 'draft' | 'published' | 'archived';
  available_from?: string | null;
  available_until?: string | null;
  questions?: QuestionCreateRequest[];
}

export interface QuizUpdateRequest {
  name?: string;
  description?: string;
  clid?: string;
  settings_json?: string;
  status?: 'draft' | 'published' | 'archived';
  available_from?: string | null;
  available_until?: string | null;
  questions?: QuestionUpdateRequest[]; // Now supports updating questions
}

// ====== ATTEMPT TYPES ======

export interface Answer {
  answer_json: string;
  is_correct?: boolean;
  points_awarded?: number;
  question?: {
    ques_id: string;
    content: string;
    options_json?: string;
    answer_key_json: string;
    points: number;
  };
}

export interface Attempt {
  atid: string;
  quiz_id: string;
  student_id: string;
  status: 'in_progress' | 'submitted' | 'graded';
  attempt_number: number;
  score?: number | null;
  max_score?: number;
  percentage?: number | null;
  started_at: string;
  submitted_at?: string | null;
  completed_at?: string | null;
  updated_at?: string;
  quiz?: {
    qid: string;
    name: string;
  };
  student?: {
    sid: string;
    name: string;
  };
  answers?: Answer[];
}

// ====== ATTEMPT REQUEST TYPES ======

export interface AttemptCreateRequest {
  quiz_id: string;
  student_id: string;
}

export interface AttemptAnswerRequest {
  question_id: string;
  answer_json: string;
}

export interface AttemptSubmitRequest {
  answers: AttemptAnswerRequest[];
}

export interface AttemptUpdateRequest {
  score?: number;
  status?: 'in_progress' | 'submitted' | 'graded';
  percentage?: number;
}
