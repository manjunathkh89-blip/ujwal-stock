import React, { useState, useMemo } from 'react';
import { QUIZ_QUESTIONS } from '../data/quiz';
import { CATEGORIES } from '../data/categories';
import { CheckCircle2, XCircle, RotateCcw, Award, ChevronRight, HelpCircle } from 'lucide-react';

export const QuizView: React.FC<{ onSelectCategoryForCommands?: (catId: string) => void }> = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, { selected: number; isCorrect: boolean }>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const filteredQuestions = useMemo(() => {
    if (selectedCategory === 'all') {
      return QUIZ_QUESTIONS;
    }
    return QUIZ_QUESTIONS.filter((q) => q.categoryId === selectedCategory);
  }, [selectedCategory]);

  const currentQ = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    const isCorrect = selectedOption === currentQ.correctIndex;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: { selected: selectedOption, isCorrect },
    }));
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserAnswers({});
    setQuizFinished(false);
  };

  const score = Object.values(userAnswers).filter((a) => a.isCorrect).length;
  const totalAnswered = Object.keys(userAnswers).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Quiz Header & Category Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#00C8FF]" />
            Kali Linux Knowledge Quiz
          </h2>
          <p className="text-xs sm:text-sm text-[#7C8DA0] mt-1">
            Test your knowledge across 13 ethical hacking topics (5 curated questions per category).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-[#7C8DA0] shrink-0 font-medium">Topic:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleRestartQuiz();
            }}
            className="bg-[#05080F] text-[#C9D6E2] border border-slate-800 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-[#00C8FF] font-medium"
          >
            <option value="all">All Topics ({QUIZ_QUESTIONS.length} Questions)</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.shortName} (5 Qs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {!quizFinished && currentQ ? (
        <div className="rounded-xl border border-[#00C8FF]/15 bg-[rgba(10,15,25,0.85)] backdrop-blur-[12px] p-5 sm:p-6 space-y-6 shadow-md">
          {/* Progress and Counter */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#7C8DA0]">
              <span className="font-mono text-[#00C8FF] font-semibold">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </span>
              <span>
                Score: {score} / {totalAnswered}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#05080F] rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-[#00C8FF] to-[#2F6BFF] transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">
              {CATEGORIES.find((c) => c.id === currentQ.categoryId)?.name || 'General'}
            </span>
            <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQ.correctIndex;
              let btnStyle = 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700';

              if (isAnswerSubmitted) {
                if (isCorrectAnswer) {
                  btnStyle = 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-semibold';
                } else if (isSelected) {
                  btnStyle = 'border-rose-500 bg-rose-950/50 text-rose-300';
                } else {
                  btnStyle = 'border-slate-900 bg-slate-950/50 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm transition-all duration-150 flex items-start gap-3 ${btnStyle}`}
                >
                  <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center shrink-0 text-xs font-mono mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{opt}</span>
                  {isAnswerSubmitted && isCorrectAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectAnswer && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                selectedOption === currentQ.correctIndex
                  ? 'bg-emerald-950/20 border-emerald-900/60 text-emerald-300'
                  : 'bg-rose-950/20 border-rose-900/60 text-rose-300'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {selectedOption === currentQ.correctIndex ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Correct!
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-rose-400" /> Incorrect
                  </>
                )}
              </div>
              <p className="text-slate-300">{currentQ.explanation}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRestartQuiz}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restart Topic
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-slate-950 font-bold rounded-lg text-xs sm:text-sm transition-colors"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-1.5"
              >
                {currentIndex + 1 < filteredQuestions.length ? (
                  <>
                    Next Question <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    View Final Score <Award className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div className="p-8 rounded-xl border border-slate-800 bg-slate-950 text-center space-y-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Quiz Completed!</h3>
            <p className="text-sm text-slate-400 mt-1">Here is how you performed on this challenge:</p>
          </div>

          <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 inline-block min-w-[240px]">
            <div className="text-4xl font-extrabold font-mono text-emerald-400">
              {score} / {filteredQuestions.length}
            </div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              Final Score ({Math.round((score / filteredQuestions.length) * 100)}%)
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {score === filteredQuestions.length
              ? 'Flawless score! You have solid command mastery. Ready for real penetration testing lab drills.'
              : score >= filteredQuestions.length * 0.7
              ? 'Great job! You have a solid grasp of Kali Linux concepts. Review the missed commands in the guide.'
              : 'Good effort! Review the plain-English command cards and test them in the terminal sandbox.'}
          </p>

          <div className="pt-3 flex items-center justify-center gap-3">
            <button
              onClick={handleRestartQuiz}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
