import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, History } from 'lucide-react';
import { supabase } from './supabase';

interface LoveCalculation {
  id: string;
  name1: string;
  name2: string;
  percentage: number;
  created_at: string;
}

function App() {
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [recentCalculations, setRecentCalculations] = useState<LoveCalculation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchRecentCalculations();
  }, []);

  const fetchRecentCalculations = async () => {
    const { data, error } = await supabase
      .from('love_calculations')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching calculations:', error);
      return;
    }

    setRecentCalculations(data);
  };

  const calculateLove = async () => {
    if (!name1 || !name2) return;
    
    setIsCalculating(true);
    
    // Create a deterministic but seemingly random result based on names
    const combinedNames = `${name1.toLowerCase()}${name2.toLowerCase()}`;
    let hash = 0;
    for (let i = 0; i < combinedNames.length; i++) {
      hash = ((hash << 5) - hash) + combinedNames.charCodeAt(i);
      hash = hash & hash;
    }
    
    const lovePercentage = Math.abs(hash % 101); // 0-100

    // Store the calculation in Supabase
    const { error } = await supabase
      .from('love_calculations')
      .insert([
        {
          name1,
          name2,
          percentage: lovePercentage
        }
      ]);

    if (error) {
      console.error('Error storing calculation:', error);
    } else {
      await fetchRecentCalculations();
    }

    // Simulate calculation delay for fun
    setTimeout(() => {
      setResult(lovePercentage);
      setIsCalculating(false);
    }, 1500);
  };

  const getResultMessage = (score: number) => {
    if (score >= 80) return "Perfect Match! 💘";
    if (score >= 60) return "Great Potential! 💝";
    if (score >= 40) return "Worth a Try! 💖";
    return "Keep Looking! 💔";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-pink-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Love Calculator</h1>
          <p className="text-gray-600">Calculate your love compatibility!</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Their Name</label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
              placeholder="Enter their name"
            />
          </div>

          <button
            onClick={calculateLove}
            disabled={!name1 || !name2 || isCalculating}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-lg font-semibold 
                     hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50
                     flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                Calculating...
              </>
            ) : (
              'Calculate Love'
            )}
          </button>

          {result !== null && !isCalculating && (
            <div className="mt-6 text-center animate-fade-in">
              <div className="text-4xl font-bold text-pink-500 mb-2">
                {result}%
              </div>
              <div className="text-lg font-medium text-gray-700">
                {getResultMessage(result)}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {name1} + {name2}
              </p>
            </div>
          )}

                
              </div>
            
          </div>
        </div>
     
  );
}

export default App;