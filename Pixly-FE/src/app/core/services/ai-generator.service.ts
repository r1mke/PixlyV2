// ai-generator.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import {OpenAI} from 'openai';

export interface ImageGenerationRequest {
  prompt: string;
  size?: '256x256' | '512x512' | '1024x1024';
  model?: 'dall-e-2' | 'dall-e-3';
  quality?: 'standard' | 'hd';
  style?: 'natural' | 'vivid';
}

export interface ImageGenerationResponse {
  url: string;
  revised_prompt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiGeneratorService {
 private readonly apiUrl = 'https://api.openai.com/v1/images/generations';

  constructor(private http: HttpClient) {}

  generateImage(request: ImageGenerationRequest): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${environment.openaiApiKey}`,
      'Content-Type': 'application/json'
    };

    const body = {
      model: request.model || 'dall-e-3',
      prompt: request.prompt,
      n: 1,
      size: request.size || '1024x1024',
      quality: request.quality || 'standard',
      style: request.style || 'natural'
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}