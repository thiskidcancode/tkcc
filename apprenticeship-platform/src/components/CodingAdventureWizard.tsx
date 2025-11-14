"use client";
import { useState, useEffect } from "react";
import { ChevronRight, Star, Rocket, Trophy, Heart } from "lucide-react";

interface Step {
  id: number;
  title: string;
  emoji: string;
  description: string;
  timeEstimate: string;
  isComplete: boolean;
}

export default function CodingAdventureWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 0,
      title: "Device Detective",
      emoji: "🕵️‍♀️",
      description: "Find out what computer you have",
      timeEstimate: "1 min",
      isComplete: false,
    },
    {
      id: 1,
      title: "GitHub Superhero",
      emoji: "🦸‍♂️",
      description: "Create your secret coder account",
      timeEstimate: "3 min",
      isComplete: false,
    },
    {
      id: 2,
      title: "Coding Spaceship",
      emoji: "🚀",
      description: "Launch your coding environment",
      timeEstimate: "2 min",
      isComplete: false,
    },
    {
      id: 3,
      title: "First Program",
      emoji: "💻",
      description: "Write real code that works!",
      timeEstimate: "3 min",
      isComplete: false,
    },
    {
      id: 4,
      title: "Victory Celebration",
      emoji: "🎉",
      description: "You're officially a coder!",
      timeEstimate: "1 min",
      isComplete: false,
    },
  ]);

  const completeStep = (stepId: number) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === stepId ? { ...step, isComplete: true } : step
      )
    );
    if (stepId === 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      completeStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-green-500 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            ⭐
          </div>
        ))}
      </div>

      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-pulse">
            🎮 Welcome Future Coder! 🎮
          </h1>
          <p className="text-xl text-white/90">
            You're about to become a{" "}
            <span className="text-yellow-300 font-bold">REAL PROGRAMMER</span>!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    index <= currentStep ? "text-white" : "text-white/50"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-500 ${
                      step.isComplete
                        ? "bg-green-500 animate-bounce"
                        : index === currentStep
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-white/20"
                    }`}
                  >
                    {step.isComplete ? "✅" : step.emoji}
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-6 h-6 mx-2" />
                  )}
                </div>
              ))}
            </div>
            <div className="bg-white/10 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-400 h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Current Step Content */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            {currentStep === 0 && (
              <DeviceDetectiveStep
                onNext={nextStep}
                setDeviceType={setDeviceType}
              />
            )}
            {currentStep === 1 && (
              <GitHubHeroStep onNext={nextStep} setUserName={setUserName} />
            )}
            {currentStep === 2 && (
              <CodingSpaceshipStep onNext={nextStep} deviceType={deviceType} />
            )}
            {currentStep === 3 && (
              <FirstProgramStep onNext={nextStep} userName={userName} />
            )}
            {currentStep === 4 && <VictoryCelebration userName={userName} />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Components
function DeviceDetectiveStep({ onNext, setDeviceType }: any) {
  const [selected, setSelected] = useState("");

  const devices = [
    {
      type: "phone",
      emoji: "📱",
      name: "Phone/Tablet",
      description: "Small screen device",
    },
    {
      type: "laptop",
      emoji: "💻",
      name: "Laptop/Desktop",
      description: "Computer with keyboard",
    },
    {
      type: "chromebook",
      emoji: "📚",
      name: "Chromebook",
      description: "School computer",
    },
  ];

  const handleSelect = (type: string) => {
    setSelected(type);
    setDeviceType(type);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        🕵️‍♀️ Device Detective Mission
      </h2>
      <p className="text-lg mb-6 text-gray-600">
        Your mission: Find out what kind of computer you have!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {devices.map((device) => (
          <button
            key={device.type}
            onClick={() => handleSelect(device.type)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 hover:scale-105 ${
              selected === device.type
                ? "border-green-500 bg-green-50 text-green-800"
                : "border-gray-300 hover:border-blue-500"
            }`}
          >
            <div className="text-4xl mb-2">{device.emoji}</div>
            <div className="font-bold text-lg">{device.name}</div>
            <div className="text-sm text-gray-600">{device.description}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="animate-bounce">
          <div className="bg-green-100 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">
              ✅ Perfect! You have a{" "}
              {devices.find((d) => d.type === selected)?.name}
            </p>
          </div>
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            Next: Become a Superhero! 🦸‍♂️
          </button>
        </div>
      )}
    </div>
  );
}

function GitHubHeroStep({ onNext, setUserName }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        🦸‍♂️ Become a GitHub Superhero
      </h2>
      <p className="text-lg mb-6 text-gray-600">
        GitHub is like a secret base where all programmers keep their code!
      </p>

      <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-blue-800">
          🎬 Watch This First!
        </h3>
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showDemo ? "Hide Demo" : "Show Me How"} 📺
        </button>

        {showDemo && (
          <div className="mt-4 bg-gray-800 rounded-lg p-4 text-white">
            <p>🎥 Video: "A kid just like you creating their GitHub account"</p>
            <p className="text-sm text-gray-300 mt-2">
              Shows every single click and what to expect
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-left font-semibold mb-2">
            What should we call you?
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your awesome name"
            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
          />
        </div>

        <div>
          <label className="block text-left font-semibold mb-2">
            Parent's email (ask for help!):
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="parent@email.com"
            className="w-full p-3 border border-gray-300 rounded-lg text-lg"
          />
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
        <h4 className="font-bold text-yellow-800 mb-2">
          🚀 Ready to create your account?
        </h4>
        <a
          href="https://github.com/signup"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-block"
        >
          Open GitHub in New Tab 🔗
        </a>
      </div>

      {name && email && (
        <button
          onClick={() => {
            setUserName(name);
            onNext();
          }}
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
        >
          I Created My Account! 🎉
        </button>
      )}
    </div>
  );
}

function CodingSpaceshipStep({ onNext, deviceType }: any) {
  const [launched, setLaunched] = useState(false);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        🚀 Enter Your Coding Spaceship
      </h2>
      <p className="text-lg mb-6 text-gray-600">
        GitHub Codespaces is your personal coding spaceship that runs in your
        browser!
      </p>

      <div className="bg-purple-50 border border-purple-300 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-purple-800">
          🎯 Your Special Link
        </h3>
        <div className="bg-gray-100 p-4 rounded-lg mb-4 font-mono text-sm break-all">
          https://github.com/TKCCApprenticeship/welcome-new-coder
        </div>
        <button
          onClick={() => setLaunched(true)}
          className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          🚀 Launch My Spaceship!
        </button>
      </div>

      {launched && (
        <div className="animate-pulse">
          <div className="bg-green-100 border border-green-500 rounded-lg p-6 mb-6">
            <div className="text-6xl mb-4">🚀</div>
            <p className="text-green-800 font-semibold text-lg">
              ✅ Spaceship Launched! You should see VS Code loading...
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Wait for the cool loading animation (about 30 seconds)
            </p>
          </div>
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            My Spaceship is Ready! 💻
          </button>
        </div>
      )}
    </div>
  );
}

function FirstProgramStep({ onNext, userName }: any) {
  const [codeChanged, setCodeChanged] = useState(false);
  const [previewCode, setPreviewCode] = useState(`<h1>Hello, World!</h1>`);

  const updateCode = (newName: string) => {
    setPreviewCode(`<h1>Hello, ${newName}!</h1>`);
    setCodeChanged(true);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4 text-gray-800">
        💻 Write Your First Real Program!
      </h2>
      <p className="text-lg mb-6 text-gray-600">
        Let's make something awesome happen!
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-bold text-lg mb-3">📝 Your Code</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-left">
            <div className="text-gray-500">1</div>
            <div className="text-gray-500">2</div>
            <div className="text-yellow-300">&lt;h1&gt;</div>
            <span className="text-white">Hello, </span>
            <input
              type="text"
              value={userName}
              onChange={(e) => updateCode(e.target.value)}
              className="bg-transparent border-b border-green-400 text-green-400 outline-none"
              placeholder="Your name"
            />
            <span className="text-white">!</span>
            <div className="text-yellow-300">&lt;/h1&gt;</div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-3">🌐 Your Webpage</h3>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-h-[120px] flex items-center justify-center">
            <div
              className="text-2xl font-bold text-blue-600"
              dangerouslySetInnerHTML={{ __html: previewCode }}
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-blue-800 mb-3">
          🎨 Make it even cooler!
        </h4>
        <p className="text-sm text-gray-600 mb-3">Try adding some style:</p>
        <div className="bg-gray-100 p-3 rounded font-mono text-sm text-left">
          &lt;h1 style="color: purple; background: yellow;"&gt;Hello, {userName}
          ! 🚀&lt;/h1&gt;
        </div>
      </div>

      {codeChanged && (
        <div className="animate-bounce">
          <div className="bg-green-100 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-semibold">
              🎉 AMAZING! You just wrote real code that works!
            </p>
          </div>
          <button
            onClick={onNext}
            className="bg-gradient-to-r from-yellow-500 to-red-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            I'M A REAL PROGRAMMER! 🏆
          </button>
        </div>
      )}
    </div>
  );
}

function VictoryCelebration({ userName }: any) {
  return (
    <div className="text-center">
      <div className="text-8xl mb-6 animate-bounce">🏆</div>
      <h2 className="text-4xl font-bold mb-4 text-gray-800">🎉 VICTORY! 🎉</h2>
      <h3 className="text-2xl font-bold mb-6 text-purple-600">
        {userName}, YOU ARE NOW OFFICIALLY A CODER!
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 border border-green-300 rounded-lg p-6">
          <div className="text-3xl mb-3">✅</div>
          <h4 className="font-bold text-green-800 mb-2">What You Just Did:</h4>
          <ul className="text-left text-sm space-y-1">
            <li>• Created a programmer account</li>
            <li>• Opened a real coding environment</li>
            <li>• Wrote actual code</li>
            <li>• Built something that works!</li>
          </ul>
        </div>

        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
          <div className="text-3xl mb-3">🚀</div>
          <h4 className="font-bold text-blue-800 mb-2">Tomorrow We'll:</h4>
          <ul className="text-left text-sm space-y-1">
            <li>• Build a simple game</li>
            <li>• Make things move on screen</li>
            <li>• Add cool colors and sounds</li>
            <li>• Create something amazing!</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-6">
        <h4 className="font-bold text-yellow-800 mb-3">🏠 Show Your Family!</h4>
        <p className="text-gray-600 mb-3">
          Share your webpage with your family - they're going to be SO proud!
        </p>
        <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors">
          📱 Share My Success!
        </button>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700 mb-4">
          Ready for tomorrow's adventure?
        </p>
        <button className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform duration-200 shadow-lg">
          YES! I'M READY! 🚀
        </button>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>📞 Need help? Text/call: [mentor phone number]</p>
        <p>⏱️ Total time: 8-12 minutes</p>
      </div>
    </div>
  );
}
