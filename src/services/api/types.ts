import type {
  Topic,
  Question,
  CodingProblem,
  MachineCodingProblem,
  SystemDesignProblem,
  Category,
} from "@/types";

export interface ApiResponse<T> {
  readonly data: T;
  readonly message?: string;
  readonly success: boolean;
}

export interface ApiError {
  readonly message: string;
  readonly status?: number;
  readonly code?: string;
}

export interface ITopicsService {
  getAll(): Promise<Topic[]>;
  getByCategory(category: string): Promise<Topic[]>;
  getById(id: string): Promise<Topic | undefined>;
  getCategories(): Promise<Category[]>;
  getQuestionById(id: string): Promise<Question | undefined>;
}

export interface ICodingService {
  getAll(): Promise<CodingProblem[]>;
  getById(id: string): Promise<CodingProblem | undefined>;
}

export interface IMachineCodingService {
  getAll(): Promise<MachineCodingProblem[]>;
  getById(id: string): Promise<MachineCodingProblem | undefined>;
}

export interface ISystemDesignService {
  getAll(): Promise<SystemDesignProblem[]>;
  getById(id: string): Promise<SystemDesignProblem | undefined>;
}

export interface IApiService {
  readonly topics: ITopicsService;
  readonly coding: ICodingService;
  readonly machineCoding: IMachineCodingService;
  readonly systemDesign: ISystemDesignService;
}
