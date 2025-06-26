import React, { useState, useEffect } from 'react';
import './InsurEduGame.css'; // ใช้ CSS เดิมที่ให้มา

function InsurEduGame() {
  const [playerStatus, setPlayerStatus] = useState({
    health: 100,
    money: 10000,
    happiness: 80,
  });

  const [policies, setPolicies] = useState({
    health: null, // จะเก็บ object ของกรมธรรม์สุขภาพที่ซื้อ
    car: null,    // จะเก็บ object ของกรมธรรม์รถยนต์ที่ซื้อ
    life: null,   // จะเก็บ object ของกรมธรรม์ชีวิตที่ซื้อ
  });

  const [currentScenario, setCurrentScenario] = useState(null);
  const [message, setMessage] = useState("Welcome to InsurDrive: Life's Journey! Let's get started.");
  const [gameEnded, setGameEnded] = useState(false);
  const [level, setLevel] = useState(1); // เพิ่ม level เพื่อจำลองความก้าวหน้า

  const availablePolicies = {
    health_basic: { name: "Basic Health Insurance", cost: 1000, coverage: "Minor illness", type: "health" },
    health_premium: { name: "Premium Health Insurance", cost: 3000, coverage: "Major illness & accidents", type: "health" },
    car_basic: { name: "Third Party Car Insurance", cost: 1500, coverage: "Third party damage", type: "car" },
    car_comp: { name: "Comprehensive Car Insurance", cost: 4000, coverage: "Own damage & third party", type: "car" },
    life_basic: { name: "Basic Life Insurance", cost: 2000, coverage: "Death benefit", type: "life" },
  };

  const scenarios = [
    {
      id: 1,
      type: "life_event",
      text: "You're starting your first job! You're considering your future. Should you look into Life Insurance?",
      options: [
        { text: "Yes, explore Life Insurance options.", action: () => showPolicyMarket("life") },
        { text: "Not now, I'll focus on work first.", action: () => advanceGame("You chose to focus on work. Remember to plan for the future!") },
      ],
    },
    {
      id: 2,
      type: "risk_event",
      text: "Oh no! You suddenly feel a sharp pain in your stomach. It looks like you need medical attention.",
      options: [
        { text: "Use Health Insurance (if you have it).", action: () => handleMedicalEvent() },
        { text: "Pay out of pocket.", action: () => handleMedicalEvent(false) },
      ],
      requiresInsurance: "health",
    },
    {
      id: 3,
      type: "life_event",
      text: "You've saved enough for your first car! What kind of car insurance do you need?",
      options: [
        { text: "Check out car insurance options.", action: () => showPolicyMarket("car") },
        { text: "I'll just drive carefully without insurance.", action: () => advanceGame("You chose to drive without insurance. Drive safely!") },
      ],
    },
    {
      id: 4,
      type: "risk_event",
      text: "Minor fender bender! Your car got scratched. Is your car insured?",
      options: [
        { text: "File a claim with your Car Insurance.", action: () => handleCarAccident() },
        { text: "Pay for repairs yourself.", action: () => handleCarAccident(false) },
      ],
      requiresInsurance: "car",
    },
    {
      id: 5,
      type: "life_event",
      text: "Congratulations! You're getting married. This is a good time to review your life insurance needs.",
      options: [
          { text: "Review my Life Insurance policies.", action: () => showPolicyMarket("life", "review") },
          { text: "We'll worry about that later.", action: () => advanceGame("You decided to postpone. Planning ahead is often beneficial.") },
      ],
    },
    {
        id: 6,
        type: "risk_event",
        text: "A sudden, major illness strikes! This requires extensive medical treatment.",
        options: [
            { text: "Rely on comprehensive Health Insurance.", action: () => handleMajorMedicalEvent() },
            { text: "Seek public healthcare/pay personally.", action: () => handleMajorMedicalEvent(false) },
        ],
        requiresInsurance: "health_premium",
    }
    // เพิ่มสถานการณ์อื่นๆ อีกมากมายเพื่อความหลากหลาย
  ];

  useEffect(() => {
    if (!currentScenario && !gameEnded) {
      setTimeout(() => {
        startNextScenario();
      }, 2000);
    }
  }, [currentScenario, gameEnded]); // Dependency array

  const startNextScenario = () => {
    const nextScenarioIndex = scenarios.findIndex(s => s.id === level);
    if (nextScenarioIndex !== -1 && nextScenarioIndex < scenarios.length) {
      setCurrentScenario(scenarios[nextScenarioIndex]);
      setMessage(scenarios[nextScenarioIndex].text);
      setLevel(prev => prev + 1);
    } else {
      setMessage("You've completed your journey! Thanks for playing InsurDrive.");
      setGameEnded(true);
      setCurrentScenario(null);
    }
  };

  const advanceGame = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      startNextScenario();
    }, 3000);
  };

  const handleMedicalEvent = (useInsurance = true) => {
    if (useInsurance && policies.health) {
      setMessage(`Your ${policies.health.name} covered the costs. Health is stable!`);
      setPlayerStatus(prev => ({ ...prev, happiness: prev.happiness + 5 }));
    } else {
      const cost = 2000;
      setMessage(`Without health insurance, you paid ${cost} baht for treatment. Your money decreased!`);
      setPlayerStatus(prev => ({ ...prev, money: prev.money - cost, health: prev.health - 10, happiness: prev.happiness - 10 }));
    }
    advanceGame("");
  };

  const handleMajorMedicalEvent = (useInsurance = true) => {
    if (useInsurance && policies.health && policies.health.name === availablePolicies.health_premium.name) {
        setMessage(`Your ${policies.health.name} covered the extensive costs. You're recovering well!`);
        setPlayerStatus(prev => ({ ...prev, happiness: prev.happiness + 10 }));
    } else if (useInsurance && policies.health && policies.health.name === availablePolicies.health_basic.name) {
        const remainingCost = 5000;
        setMessage(`Your Basic Health Insurance covered some, but you still paid ${remainingCost} baht. Consider a premium plan!`);
        setPlayerStatus(prev => ({ ...prev, money: prev.money - remainingCost, health: prev.health - 5, happiness: prev.happiness - 5 }));
    } else {
        const cost = 15000;
        setMessage(`A major illness without insurance is costly! You paid ${cost} baht and your health deteriorated.`);
        setPlayerStatus(prev => ({ ...prev, money: prev.money - cost, health: prev.health - 30, happiness: prev.happiness - 20 }));
    }
    advanceGame("");
  };

  const handleCarAccident = (useInsurance = true) => {
    if (useInsurance && policies.car) {
      setMessage(`Your ${policies.car.name} covered the damages. Phew!`);
      setPlayerStatus(prev => ({ ...prev, happiness: prev.happiness + 5 }));
    } else {
      const cost = 3000;
      setMessage(`No car insurance! You paid ${cost} baht for repairs. Learn from this!`);
      setPlayerStatus(prev => ({ ...prev, money: prev.money - cost, happiness: prev.happiness - 10 }));
    }
    advanceGame("");
  };

  // State เพื่อจัดการหน้าจอ market
  const [showMarket, setShowMarket] = useState(false);
  const [marketFilter, setMarketFilter] = useState(null); // 'health', 'car', 'life'

  const showPolicyMarket = (filterType = null, mode = "buy") => {
    setMarketFilter(filterType);
    setShowMarket(true);
    if (mode === "buy") {
      setMessage("Welcome to the Insurance Market! Choose a policy.");
    } else if (mode === "review") {
      setMessage("Reviewing your current policies and available upgrades.");
    }
  };

  const buyPolicy = (policy) => {
    if (playerStatus.money >= policy.cost) {
      setMessage(`You successfully purchased ${policy.name}! Money -${policy.cost}.`);
      setPlayerStatus(prev => ({ ...prev, money: prev.money - policy.cost }));
      setPolicies(prev => ({ ...prev, [policy.type]: policy }));
      setShowMarket(false);
      advanceGame(""); // กลับสู่เกมหลักหลังจากซื้อ
    } else {
      setMessage("Not enough money to buy this policy!");
    }
  };

  const renderMarket = () => {
    const filteredPolicies = Object.values(availablePolicies).filter(
      p => marketFilter ? p.type === marketFilter : true
    );

    return (
      <div className="market-container">
        <h2>Insurance Market</h2>
        <div className="policy-list">
          {filteredPolicies.length > 0 ? (
            filteredPolicies.map((policy, index) => (
              <div key={index} className="policy-card">
                <h3>{policy.name}</h3>
                <p>Cost: {policy.cost} Baht</p>
                <p>Coverage: {policy.coverage}</p>
                {policies[policy.type]?.name === policy.name ? (
                  <p className="owned-policy">Owned</p>
                ) : (
                  <button onClick={() => buyPolicy(policy)} disabled={playerStatus.money < policy.cost}>
                    Buy ({policy.cost} Baht)
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No policies available for this category.</p>
          )}
        </div>
        <button className="close-market-btn" onClick={() => { setShowMarket(false); advanceGame(""); }}>
          Back to Journey
        </button>
      </div>
    );
  };

  const renderGameContent = () => {
    if (showMarket) {
      return renderMarket();
    }
    if (gameEnded) {
        return (
            <div className="game-end-screen">
                <h2>Game Over!</h2>
                <p>{message}</p>
                <p>Final Status:</p>
                <p>Health: {playerStatus.health}</p>
                <p>Money: {playerStatus.money}</p>
                <p>Happiness: {playerStatus.happiness}</p>
                <button onClick={() => {
                    setPlayerStatus({ health: 100, money: 10000, happiness: 80 });
                    setPolicies({ health: null, car: null, life: null });
                    setMessage("Welcome to InsurDrive: Life's Journey! Let's get started.");
                    setGameEnded(false);
                    setLevel(1);
                    setCurrentScenario(null); // Reset to trigger useEffect
                }}>
                    Start New Game
                </button>
            </div>
        );
    }
    return (
      <>
        <div className="message-box">
          <p>{message}</p>
        </div>

        {currentScenario && (
          <div className="scenario-box">
            <p className="scenario-text">{currentScenario.text}</p>
            <div className="options">
              {currentScenario.options.map((option, index) => (
                <button key={index} onClick={option.action}>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ปุ่มสำหรับเปิดตลาดประกันภัยด้วยตนเอง */}
        <button onClick={() => showPolicyMarket()} style={{ marginTop: '20px' }}>
          Visit Insurance Market
        </button>

        {/* Placeholder for AI Chatbot / Insur-Buddy */}
        <div className="insur-buddy-section">
          <h3>Insur-Buddy (AI Assistant)</h3>
          <p>Ask me anything about insurance!</p>
          {/* ตรงนี้จะมีการเชื่อมต่อกับ AI Chatbot API จริงๆ */}
          <textarea placeholder="Type your question here..." rows="3"></textarea>
          <button>Ask</button>
        </div>
      </>
    );
  };

  return (
    <div className="game-container">
      <h1>InsurDrive: ชีวิตไม่สะดุด ประกันภัยไม่สะเทือน</h1>
      <div className="player-status">
        <p>Health: {playerStatus.health}</p>
        <p>Money: {playerStatus.money}</p>
        <p>Happiness: {playerStatus.happiness}</p>
        {policies.health && <p>Health Ins: {policies.health.name}</p>}
        {policies.car && <p>Car Ins: {policies.car.name}</p>}
        {policies.life && <p>Life Ins: {policies.life.name}</p>}
      </div>

      <div className="game-area">
        {renderGameContent()}
      </div>
    </div>
  );
}

export default InsurEduGame;