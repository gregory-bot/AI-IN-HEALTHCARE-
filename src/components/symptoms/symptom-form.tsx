import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { toast } from 'react-hot-toast';
import { analyzeSymptoms } from '../../lib/ml-model';
import { useState } from 'react';
import { AIAnalysis } from '../analysis/ai-analysis';

const symptomSchema = z.object({
  mainSymptom: z.string().min(3, 'Please describe your main symptom'),
  duration: z.string().min(1, 'Please specify the duration'),
  severity: z.enum(['mild', 'moderate', 'severe']),
  additionalInfo: z.string().optional(),
});

type SymptomFormData = z.infer<typeof symptomSchema>;

export function SymptomForm() {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SymptomFormData>({
    resolver: zodResolver(symptomSchema),
  });

  const onSubmit = async (data: SymptomFormData) => {
    setIsAnalyzing(true);
    try {
      const symptomText = `${data.mainSymptom} ${data.additionalInfo || ''}. Severity: ${data.severity}. Duration: ${data.duration}`;
      const result = await analyzeSymptoms(symptomText);
      setAnalysis(result);
      toast.success('Symptoms analyzed successfully!');
    } catch (error) {
      toast.error('Failed to analyze symptoms. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('https://images.pexels.com/photos/3786235/pexels-photo-3786235.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
    >
      <div className="w-full max-w-2xl mx-auto bg-white/90 backdrop-blur-md rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Describe Your Symptoms</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              main symptom
              <textarea
                {...register('mainSymptom')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your main symptom in detail"
              />
            </label>
            {errors.mainSymptom && (
              <p className="mt-1 text-sm text-red-600">{errors.mainSymptom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration
              <input
                type="text"
                {...register('duration')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="How long have you experienced this symptom?"
              />
            </label>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Severity
              <select
                {...register('severity')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </label>
            {errors.severity && (
              <p className="mt-1 text-sm text-red-600">{errors.severity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Additional Information
              <textarea
                {...register('additionalInfo')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
                placeholder="Any other relevant information"
              />
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing Symptoms...' : isSubmitting ? 'Submitting...' : 'Submit Symptoms'}
          </Button>
        </form>
      </div>

      {analysis && <AIAnalysis symptoms={{ mainSymptom: analysis.condition }} />}
    </div>
  );
}
