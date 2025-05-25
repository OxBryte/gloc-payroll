import { useState, useEffect } from "react";
import { diceFaces } from "../data/diceFace";

// Dice faces as SVG paths

export default function DiceGame() {
  // Game state
  const [balance, setBalance] = useState(5000);
  const [betAmount, setBetAmount] = useState(10);
  const [selectedOption, setSelectedOption] = useState("over"); // 'over' or 'under'
  const [targetNumber, setTargetNumber] = useState(50); // 1-100
  const [diceResult, setDiceResult] = useState(null);
  const [diceValue, setDiceValue] = useState(null); // 1-6
  const [rolling, setRolling] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [multiplier, setMultiplier] = useState(2);

  // Calculate multiplier based on probability
  useEffect(() => {
    let probability;
    if (selectedOption === "over") {
      probability = (100 - targetNumber) / 100;
    } else {
      probability = targetNumber / 100;
    }
    // Add house edge of 2%
    const fairMultiplier = 1 / probability;
    const withHouseEdge = fairMultiplier * 0.98;
    setMultiplier(parseFloat(withHouseEdge.toFixed(2)));
  }, [targetNumber, selectedOption]);

  // Handle bet amount change
  const handleBetChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > balance) {
      value = balance;
    }
    setBetAmount(value);
  };

  // Handle target number change
  const handleTargetChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > 99) {
      value = 99;
    }
    setTargetNumber(value);
  };

  // Handle bet option selection
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  // Adjust target by fixed amounts
  const adjustTarget = (amount) => {
    let newTarget = targetNumber + amount;
    if (newTarget < 1) newTarget = 1;
    if (newTarget > 99) newTarget = 99;
    setTargetNumber(newTarget);
  };

  // Roll the dice
  const rollDice = () => {
    if (rolling || betAmount > balance || betAmount <= 0) return;

    setRolling(true);
    setMessage("");

    // Deduct bet amount from balance
    setBalance((prev) => prev - betAmount);

    // Simulate dice rolling animation
    const rollFrames = 20;
    let currentFrame = 0;

    const rollInterval = setInterval(() => {
      // Generate random dice value for animation
      const randomDice = Math.floor(Math.random() * 6) + 1;
      setDiceValue(randomDice);

      currentFrame++;
      if (currentFrame >= rollFrames) {
        clearInterval(rollInterval);

        // Generate final result (1-100)
        const result = Math.floor(Math.random() * 100) + 1;
        setDiceResult(result);

        // Generate final dice value (1-6) that roughly corresponds to the result
        const finalDiceValue = Math.floor((result / 100) * 6) + 1;
        setDiceValue(finalDiceValue);

        // Check if bet wins
        let win = false;
        if (selectedOption === "over" && result > targetNumber) {
          win = true;
        } else if (selectedOption === "under" && result < targetNumber) {
          win = true;
        }

        // Update balance and show message
        if (win) {
          const winAmount = Math.floor(betAmount * multiplier);
          setBalance((prev) => prev + winAmount);
          setMessage(`You won $${winAmount - betAmount}!`);
        } else {
          setMessage(`You lost $${betAmount}!`);
        }

        // Add to history
        setHistory((prev) => [
          {
            id: Date.now(),
            result,
            win,
            betAmount,
            option: selectedOption,
            target: targetNumber,
            payout: win ? Math.floor(betAmount * multiplier) : 0,
          },
          ...prev.slice(0, 9), // Keep only last 10 rolls
        ]);

        setRolling(false);
      }
    }, 50);
  };

  // Get result color
  const getResultColor = (result) => {
    if (result === null) return "text-gray-500";
    if (selectedOption === "over") {
      return result > targetNumber ? "text-green-500" : "text-red-500";
    } else {
      return result < targetNumber ? "text-green-500" : "text-red-500";
    }
  };

  return (
    <>
      <div className="space-y-10 q-full">
        {/* Game Controls */}
        <div className="bg-c-bg rounded-lg min-h-[60dvh] flex flex-col md:flex-row gap-0 h-full">
          {/* Left Column - Game Info */}
          <div className="flex flex-col p-4 gap-5 w-full max-w-[300px] border-r border-r-c-border">
            <div className="w-full px-5 py-3 bg-c-color rounded-lg flex items-center justify-center">
              Manual
            </div>
            <div className="!space-y-3">
              {/* Balance */}
              <div className="flex items-center justify-between gap-5">
                <h2 className="text-sm font-light text-white">Balance</h2>
                <p className="text-sm font-light">
                  ${balance.toLocaleString()}
                </p>
              </div>
              {/* Betting Options */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number"
                  value={betAmount}
                  onChange={handleBetChange}
                  className="bg-white/10 px-4 py-2 rounded-md w-full text-lg text-white"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setBetAmount(Math.max(1, Math.floor(betAmount / 2)))
                  }
                  className="bg-white/10 py-1 px-3 cursor-pointer rounded-md flex-1"
                >
                  ½
                </button>
                <button
                  onClick={() =>
                    setBetAmount(
                      betAmount * 2 <= balance ? betAmount * 2 : balance
                    )
                  }
                  className="bg-white/10 cursor-pointer py-1 px-3 rounded-md flex-1"
                >
                  2×
                </button>
                <button
                  onClick={() => setBetAmount(balance)}
                  className="bg-white/10 py-1 px-3 cursor-pointer rounded-md flex-1"
                >
                  Max
                </button>
              </div>
            </div>
            <button
              onClick={rollDice}
              disabled={rolling || betAmount > balance || betAmount <= 0}
              className={`w-full py-4 rounded-md text-sm font-bold 
                    ${
                      rolling || betAmount > balance || betAmount <= 0
                        ? "bg-white/10 cursor-not-allowed"
                        : "bg-c-color hover:bg-c-bg-2 cursor-pointer text-white"
                    }`}
            >
              {rolling ? "Rolling..." : "Roll Dice"}
            </button>
          </div>

          {/* Right Column - Game Display */}
          <div className="flex flex-col w-full gap-5 p-4 relative">
            {/* Dice Display */}
            <div className="h-[360px] flex flex-col justify-center items-center">
              <div className="w-32 h-32 mb-4 relative">
                {diceValue !== null ? (
                  diceFaces[diceValue - 1]
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white rounded-md">
                    <span className="text-gray-800 text-lg font-bold">
                      Roll
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute top-5 right-5 rounded-md transition-all duration-300">
              {diceResult !== null && (
                <div
                  className={`bg-c-bg-2 px-3 py-1.5 rounded-lg text-sm ${getResultColor(
                    diceResult
                  )}`}
                >
                  {diceResult}
                </div>
              )}

              {/* {message && (
                <div
                  className={`text-xl font-bold ${
                    message.includes("won") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {message}
                </div>
              )} */}
            </div>

            {/* Bet Settings */}
            <div className="bg-gray-700 rounded-md space-y-3 p-5">
              <h2 className="text-sm font-medium text-white">Prediction</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOptionChange("under")}
                  className={`flex-1 py-2 rounded-md ${
                    selectedOption === "under" ? "bg-c-color" : "bg-white/10"
                  }`}
                >
                  Under
                </button>
                <button
                  onClick={() => handleOptionChange("over")}
                  className={`flex-1 py-2 rounded-md ${
                    selectedOption === "over" ? "bg-c-color" : "bg-white/10"
                  }`}
                >
                  Over
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => adjustTarget(-1)}
                  className="bg-white/10 w-10 h-10 flex items-center justify-center rounded-md"
                >
                  -
                </button>
                <input
                  type="number"
                  value={targetNumber}
                  onChange={handleTargetChange}
                  className="bg-white/10 p-2 rounded-md w-full text-center text-lg"
                />
                <button
                  onClick={() => adjustTarget(1)}
                  className="bg-white/10 w-10 h-10 flex items-center justify-center rounded-md"
                >
                  +
                </button>
              </div>

              {/* <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => adjustTarget(-10)}
                    className="bg-white/10 py-1 px-3 rounded-md flex-1"
                  >
                    -10
                  </button>
                  <button
                    onClick={() => adjustTarget(-5)}
                    className="bg-white/10 py-1 px-3 rounded-md flex-1"
                  >
                    -5
                  </button>
                  <button
                    onClick={() => adjustTarget(5)}
                    className="bg-white/10 py-1 px-3 rounded-md flex-1"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => adjustTarget(10)}
                    className="bg-white/10 py-1 px-3 rounded-md flex-1"
                  >
                    +10
                  </button>
                </div> */}

              <div className="bg-gray-800 text-white p-3 space-y-1 rounded-md">
                <div className="flex justify-between text-sm">
                  <span>Win Chance:</span>
                  <span>
                    {selectedOption === "over"
                      ? `${100 - targetNumber}%`
                      : `${targetNumber}%`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Multiplier:</span>
                  <span>×{multiplier}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Potential Win:</span>
                  <span>${Math.floor(betAmount * multiplier)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-c-bg rounded-md p-5 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-white">History</h2>
          </div>

          <div className="max-h-40 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-1">Result</th>
                  <th className="text-left py-1">Target</th>
                  <th className="text-right py-1">Bet</th>
                  <th className="text-right py-1">Payout</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/10 last:border-0"
                  >
                    <td
                      className={`py-1 ${
                        item.win ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {item.result}
                    </td>
                    <td className="py-1">
                      {item.option === "over"
                        ? `>${item.target}`
                        : `<${item.target}`}
                    </td>
                    <td className="text-right py-1">${item.betAmount}</td>
                    <td className="text-right py-1">${item.payout}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
