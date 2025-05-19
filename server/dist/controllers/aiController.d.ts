import { Request, Response } from 'express';
export declare const initializeAI: () => Promise<void>;
export declare const getAIMove: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const trainAI: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const evaluatePosition: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
