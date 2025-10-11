import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Search, AlertTriangle, CheckCircle, HelpCircle, Zap, Loader2, ShieldCheck } from 'lucide-react';

export function ValidateFacts() {
  const [claim, setClaim] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:3000/api/validate-facts';

  const validateFact = async () => {
    if (!claim.trim()) {
      setError('Please enter a claim or statement to validate.');
      return;
    }
    
    if (claim.length < 10) {
      setError('Please enter a longer claim for accurate validation.');
      return;
    }

    setIsValidating(true);
    setError('');
    setValidationResult(null);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: claim }),
      });

      if (!response.ok) {
        throw new Error(`Validation error: ${response.status}`);
      }

      const result = await response.json();
      setValidationResult(result);

    } catch (err) {
      console.error('Error validating fact:', err);
      setError('Failed to validate fact. Please try again later.');
    } finally {
      setIsValidating(false);
    }
  };

  const clearValidation = () => {
    setClaim('');
    setValidationResult(null);
    setError('');
  };

  const getRatingColor = (rating) => {
    switch (rating?.toLowerCase()) {
      case 'likely true':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'possibly true':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'questionable':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'likely false':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating?.toLowerCase()) {
      case 'likely true':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'possibly true':
        return <HelpCircle className="w-5 h-5 text-blue-600" />;
      case 'questionable':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'likely false':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <HelpCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-300/30 shadow-md">
              <CheckCircle className="w-6 h-6 text-violet-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600">
              Validate Facts
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Enter a statement or paragraph to check for factual claims using AI-powered analysis
          </p>
        </div>

        {/* Input Card */}
        <Card className="shadow-2xl border-2 border-violet-200/50 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Fact Validator</CardTitle>
            <CardDescription className="text-gray-500">
              Enter any claim, statement, or news to check its accuracy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              placeholder="Enter a claim to validate (e.g., 'Vaccines contain microchips' or 'Climate change is real')..."
              className="w-full min-h-[150px] p-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-violet-500 text-gray-800 transition-all duration-200 resize-none"
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              disabled={isValidating}
            />
            <div className="flex gap-2">
              <Button 
                onClick={validateFact}
                disabled={isValidating || !claim.trim()} 
                className="px-6 py-2 rounded-lg text-white font-semibold shadow-lg transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] 
                         bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Validate Fact'
                )}
              </Button>
              <Button 
                onClick={clearValidation}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500 bg-red-50/70 text-red-700 shadow-lg">
            <AlertTriangle className="w-5 h-5 mt-1 shrink-0" />
            <div>
              <div className="font-semibold text-lg">Validation Failed</div>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Display */}
        {validationResult && (
          <Card className="shadow-2xl border-2 border-violet-200/50 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <ShieldCheck className="w-5 h-5 text-violet-600"/>
                Validation Result
              </CardTitle>
              <CardDescription className="text-gray-500">
                AI analysis of your claim
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3">
                {getRatingIcon(validationResult.rating)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge className={`${getRatingColor(validationResult.rating)} font-medium`}>
                      {validationResult.rating}
                    </Badge>
                    <Badge variant="outline" className="bg-white">
                      {validationResult.confidence}% Confidence
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Original Claim:</span>
                  <p className="text-gray-900 mt-1 bg-gray-50 p-3 rounded border text-sm">{validationResult.claim}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Analysis:</span>
                  <p className="text-gray-700 mt-1">{validationResult.explanation}</p>
                </div>
                
                {validationResult.evidence && validationResult.evidence.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Key Findings:</span>
                    <ul className="mt-2 space-y-1">
                      {validationResult.evidence.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {validationResult.details && (
                  <div className="text-xs text-gray-500 border-t pt-2">
                    <span className="font-medium">Analysis Method: </span>
                    {validationResult.details.analysisMethod}
                    {validationResult.details.source && (
                      <span> • Source: {validationResult.details.source}</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default ValidateFacts;