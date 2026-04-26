export interface QuizType {
    id: number;
    name: string;
    questions:QuizQuestionType[]
}

export interface QuizQuestionType {
    id: number;
    question: string;
    answers: QuizAnswerType[]
}

export interface QuizAnswerType {
    id: number;
    answer: string;
}
