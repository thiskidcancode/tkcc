"use client";

import { useState, useEffect } from "react";
import { Star, Trophy, Zap, Award, CheckCircle, Rocket } from "lucide-react";

// TypeScript interfaces for progress data
interface Lesson {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  completedAt?: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

interface ProgressData {
  lessons: Lesson[];
  achievements: Achievement[];
  totalPoints: number;
  streak: number;
}

const DEFAULT_PROGRESS: ProgressData = {
  lessons: [
    {
      id: "lesson-1",
      title: "Hello World",
      description: "Your first program",
      isComplete: false,
    },
    {
      id: "lesson-2",
      title: "Variables & Data Types",
      description: "Store information in code",
      isComplete: false,
    },
    {
      id: "lesson-3",
      title: "Loops & Iteration",
      description: "Repeat actions efficiently",
      isComplete: false,
    },
    {
      id: "lesson-4",
      title: "Functions",
      description: "Organize your code",
      isComplete: false,
    },
    {
      id: "lesson-5",
      title: "Arrays & Objects",
      description: "Work with collections",
      isComplete: false,
    },
  ],
  achievements: [
    {
      id: "first-steps",
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      isUnlocked: false,
    },
    {
      id: "rising-star",
      title: "Rising Star",
      description: "Complete 3 lessons",
      icon: "⭐",
      isUnlocked: false,
    },
    {
      id: "code-warrior",
      title: "Code Warrior",
      description: "Complete all lessons",
      icon: "🏆",
      isUnlocked: false,
    },
    {
      id: "streak-master",
      title: "Streak Master",
      description: "Learn 5 days in a row",
      icon: "🔥",
      isUnlocked: false,
    },
  ],
  totalPoints: 0,
  streak: 0,
};

export default function StudentProgressDashboard() {
  // Generate confetti positions once using useMemo
  const confettiPositions = useState(() =>
    Array.from({ length: 30 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 1,
      duration: 1 + Math.random(),
      emoji: ["🎉", "✨", "🌟", "⭐", "🎊"][Math.floor(Math.random() * 5)],
    }))
  )[0];

  const [progress, setProgress] = useState<ProgressData>(() => {
    // Load from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedProgress = localStorage.getItem("studentProgress");
      if (savedProgress) {
        try {
          return JSON.parse(savedProgress);
        } catch (error) {
          console.error("Error loading progress:", error);
        }
      }
    }
    return DEFAULT_PROGRESS;
  });
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState("");

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("studentProgress", JSON.stringify(progress));
  }, [progress]);

  const calculateProgress = () => {
    const completed = progress.lessons.filter((l) => l.isComplete).length;
    const total = progress.lessons.length;
    return {
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0,
    };
  };

  const checkAchievements = (updatedLessons: Lesson[]) => {
    const completedCount = updatedLessons.filter((l) => l.isComplete).length;
    const newAchievements = [...progress.achievements];

    // Check First Steps achievement
    if (completedCount >= 1 && !newAchievements[0].isUnlocked) {
      newAchievements[0].isUnlocked = true;
      newAchievements[0].unlockedAt = new Date().toISOString();
      triggerCelebration("🎯 First Steps Unlocked!");
    }

    // Check Rising Star achievement
    if (completedCount >= 3 && !newAchievements[1].isUnlocked) {
      newAchievements[1].isUnlocked = true;
      newAchievements[1].unlockedAt = new Date().toISOString();
      triggerCelebration("⭐ Rising Star Unlocked!");
    }

    // Check Code Warrior achievement
    if (completedCount === updatedLessons.length && !newAchievements[2].isUnlocked) {
      newAchievements[2].isUnlocked = true;
      newAchievements[2].unlockedAt = new Date().toISOString();
      triggerCelebration("🏆 Code Warrior Unlocked!");
    }

    return newAchievements;
  };

  const triggerCelebration = (message: string) => {
    setCelebrationMessage(message);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const toggleLessonComplete = (lessonId: string) => {
    setProgress((prev) => {
      const updatedLessons = prev.lessons.map((lesson) =>
        lesson.id === lessonId
          ? {
              ...lesson,
              isComplete: !lesson.isComplete,
              completedAt: !lesson.isComplete ? new Date().toISOString() : undefined,
            }
          : lesson
      );

      const newAchievements = checkAchievements(updatedLessons);
      const completedCount = updatedLessons.filter((l) => l.isComplete).length;

      return {
        ...prev,
        lessons: updatedLessons,
        achievements: newAchievements,
        totalPoints: completedCount * 100,
      };
    });
  };

  const progressStats = calculateProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      {/* Celebration Animation */}
      {showCelebration && (
        <div 
          className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-white rounded-2xl p-8 shadow-2xl animate-bounce">
            <div className="text-4xl font-bold text-purple-600">{celebrationMessage}</div>
          </div>
          {confettiPositions.map((pos, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-ping"
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animationDelay: `${pos.delay}s`,
                animationDuration: `${pos.duration}s`,
              }}
            >
              {pos.emoji}
            </div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Rocket className="w-10 h-10 md:w-12 md:h-12" />
            My Coding Journey
          </h1>
          <p className="text-xl text-white/90">Track your progress and earn achievements!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            role="region"
            aria-label="Total points"
          >
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" aria-hidden="true" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{progress.totalPoints}</div>
                <div className="text-sm text-gray-600">Total Points</div>
              </div>
            </div>
          </div>

          <div 
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            role="region"
            aria-label="Completed lessons"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" aria-hidden="true" />
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {progressStats.completed}/{progressStats.total}
                </div>
                <div className="text-sm text-gray-600">Lessons Done</div>
              </div>
            </div>
          </div>

          <div 
            className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            role="region"
            aria-label="Current streak"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-orange-500" aria-hidden="true" />
              <div>
                <div className="text-2xl font-bold text-gray-800">{progress.streak} 🔥</div>
                <div className="text-sm text-gray-600">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div 
          className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg mb-8"
          role="region"
          aria-label="Overall progress"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-gray-800">Overall Progress</h2>
            <span className="text-lg font-semibold text-purple-600">
              {Math.round(progressStats.percentage)}%
            </span>
          </div>
          <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end pr-2"
              style={{ width: `${progressStats.percentage}%` }}
              role="progressbar"
              aria-valuenow={Math.round(progressStats.percentage)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Progress: ${Math.round(progressStats.percentage)} percent complete`}
            >
              {progressStats.percentage > 10 && (
                <Trophy className="w-4 h-4 text-white" aria-hidden="true" />
              )}
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="w-6 h-6" aria-hidden="true" />
            Your Lessons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {progress.lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => toggleLessonComplete(lesson.id)}
                className={`bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg text-left transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  lesson.isComplete
                    ? "ring-4 ring-green-400"
                    : "hover:ring-2 hover:ring-purple-400"
                }`}
                aria-pressed={lesson.isComplete}
                aria-label={`${lesson.title}: ${lesson.description}. ${
                  lesson.isComplete ? "Completed" : "Not completed"
                }. Click to toggle.`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-600">{lesson.description}</p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ml-2 ${
                      lesson.isComplete
                        ? "bg-green-500 animate-pulse"
                        : "bg-gray-300"
                    }`}
                    aria-hidden="true"
                  >
                    {lesson.isComplete ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                {lesson.isComplete && lesson.completedAt && (
                  <div className="text-xs text-green-600 font-semibold">
                    ✓ Completed {new Date(lesson.completedAt).toLocaleDateString()}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" aria-hidden="true" />
            Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {progress.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg text-center transition-all duration-300 ${
                  achievement.isUnlocked
                    ? "ring-4 ring-yellow-400 animate-pulse"
                    : "opacity-60 grayscale"
                }`}
                role="region"
                aria-label={`Achievement: ${achievement.title}. ${
                  achievement.isUnlocked ? "Unlocked" : "Locked"
                }`}
              >
                <div className="text-5xl mb-3" aria-hidden="true">
                  {achievement.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="text-xs text-yellow-600 font-semibold">
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
                {!achievement.isUnlocked && (
                  <div className="text-xs text-gray-500 font-semibold">🔒 Locked</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
