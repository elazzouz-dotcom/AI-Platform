/**
 * AI Models Registry
 * Central configuration for all available AI models
 */

export interface AIModel {
  id: string;
  name: string;
  type: 'nlp' | 'cv' | 'ml' | 'custom';
  version: string;
  enabled: boolean;
  config: Record<string, any>;
}

const models: AIModel[] = [
  {
    id: 'gpt-azzouz-v1',
    name: 'GPT Azzouz V1',
    type: 'nlp',
    version: '1.0.0',
    enabled: true,
    config: { tokens: 4096, temperature: 0.7 }
  },
  {
    id: 'vision-azzouz-v1',
    name: 'Vision Azzouz V1',
    type: 'cv',
    version: '1.0.0',
    enabled: true,
    config: { resolution: '2048x2048' }
  },
  {
    id: 'ml-azzouz-v1',
    name: 'ML Azzouz V1',
    type: 'ml',
    version: '1.0.0',
    enabled: true,
    config: { algorithm: 'transformer' }
  }
];

export const aiModels = {
  getAll: () => models,
  getById: (id: string) => models.find(m => m.id === id),
  getByType: (type: string) => models.filter(m => m.type === type as any),
  enable: (id: string) => {
    const model = models.find(m => m.id === id);
    if (model) model.enabled = true;
  },
  disable: (id: string) => {
    const model = models.find(m => m.id === id);
    if (model) model.enabled = false;
  }
};