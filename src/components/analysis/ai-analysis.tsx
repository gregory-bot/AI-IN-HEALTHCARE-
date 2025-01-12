import { useEffect, useState } from 'react';
import { Activity, AlertCircle } from 'lucide-react';
import { analyzeSymptoms } from '../../lib/ml-model';

interface AIAnalysisProps {
  symptoms: {
    mainSymptom: string;
    additionalInfo?: string;
  };
}

interface Analysis {
  condition: string;
  probability: number;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

export function AIAnalysis({ symptoms }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performAnalysis = async () => {
      try {
        const result = await analyzeSymptoms(
          `${symptoms.mainSymptom} ${symptoms.additionalInfo || ''}`
        );
        setAnalysis(result);
      } catch (err) {
        setError('Failed to analyze symptoms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    performAnalysis();
  }, [symptoms]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
        <span className="ml-3 text-lg">Analyzing symptoms...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="ml-3 text-red-800">{error}</span>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">our daktari's analysis Results</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-gray-900">Possible Condition</h4>
          <p className="text-gray-700">{analysis.condition}</p>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-900">Confidence Level</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${analysis.probability * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {(analysis.probability * 100).toFixed(1)}% confidence
          </p>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-900">Urgency Level</h4>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              analysis.urgency === 'high'
                ? 'bg-red-100 text-red-800'
                : analysis.urgency === 'medium'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}
          >
            {analysis.urgency.charAt(0).toUpperCase() + analysis.urgency.slice(1)}
          </span>
        </div>

        <div>
          <h4 className="text-lg font-medium text-gray-900">Recommendations</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {analysis.recommendations.map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}