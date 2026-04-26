export interface ResultDetailsResponseType {
    error?: string;
    test: ResultDetailsTestType;
}

export interface ResultDetailsTestType {
    id: number;
    name: string;
    questions: ResultDetailsQuestionType[];
}

export interface ResultDetailsQuestionType {
    id: number;
    question: string;
    answers: ResultDetailsAnswerType[];
}

export interface ResultDetailsAnswerType {
    id: number;
    answer: string;
    correct?: boolean;
}
