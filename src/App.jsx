import { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("companyCalculatorData");
    return (
      JSON.parse(saved) || {
        personalDebit: { yesterday: 0, withdrawals: [] },
        personalCredit: { yesterday: 0, withdrawals: [] },
        companyDebit: { yesterday: 0, withdrawals: [] },
        companyCredit: { yesterday: 0, withdrawals: [] },
        himayan: { yesterday: 0, withdrawals: [] },
      }
    );
  });

  const [newAmount, setNewAmount] = useState({
    personalDebit: "",
    personalCredit: "",
    companyDebit: "",
    companyCredit: "",
    himayan: "",
  });

  const [newDeposit, setNewDeposit] = useState({
    personalDebit: "",
    personalCredit: "",
    companyDebit: "",
    companyCredit: "",
    himayan: "",
  });

  const [highlighted, setHighlighted] = useState({
    personalDebit: [],
    personalCredit: [],
    companyDebit: [],
    companyCredit: [],
    himayan: [],
  });

  // Save data automatically
  useEffect(() => {
    localStorage.setItem("companyCalculatorData", JSON.stringify(data));
  }, [data]);

  const handleYesterdayChange = (section, value) => {
    setData({
      ...data,
      [section]: { ...data[section], yesterday: Number(value) || 0 },
    });
  };

  const handleAddDeposit = (section) => {
    const amount = Number(newDeposit[section]);
    if (!amount) return;

    const updatedBalance = data[section].yesterday + amount;
    setData({
      ...data,
      [section]: { ...data[section], yesterday: updatedBalance },
    });

    setNewDeposit({ ...newDeposit, [section]: "" });
  };

  const handleAddAmount = (section) => {
    const amount = Number(newAmount[section]);
    if (!amount) return;

    const updatedWithdrawals = [...data[section].withdrawals, amount];
    setData({
      ...data,
      [section]: { ...data[section], withdrawals: updatedWithdrawals },
    });

    setNewAmount({ ...newAmount, [section]: "" });
  };

  const handleRemoveAmount = (section, index) => {
    const updatedWithdrawals = data[section].withdrawals.filter(
      (_, i) => i !== index
    );
    setData({
      ...data,
      [section]: { ...data[section], withdrawals: updatedWithdrawals },
    });

    setHighlighted((prev) => ({
      ...prev,
      [section]: prev[section].filter((i) => i !== index),
    }));
  };

  const toggleHighlight = (section, index) => {
    setHighlighted((prev) => {
      const current = prev[section] || [];
      const isHighlighted = current.includes(index);
      return {
        ...prev,
        [section]: isHighlighted
          ? current.filter((i) => i !== index)
          : [...current, index],
      };
    });
  };

  const getTotalWithdrawals = (section) =>
    data[section].withdrawals.reduce((sum, amt) => sum + amt, 0);

  const getTodayBalance = (section) =>
    data[section].yesterday - getTotalWithdrawals(section);

  // 🧹 Clear All Data Function
  const handleClearAll = () => {
    const confirmClear = window.confirm(
      "Are you sure you want to clear all data?"
    );
    if (!confirmClear) return;

    const emptyState = {
      personalDebit: { yesterday: 0, withdrawals: [] },
      personalCredit: { yesterday: 0, withdrawals: [] },
      companyDebit: { yesterday: 0, withdrawals: [] },
      companyCredit: { yesterday: 0, withdrawals: [] },
      himayan: { yesterday: 0, withdrawals: [] },
    };

    setData(emptyState);
    setNewAmount({
      personalDebit: "",
      personalCredit: "",
      companyDebit: "",
      companyCredit: "",
      himayan: "",
    });
    setNewDeposit({
      personalDebit: "",
      personalCredit: "",
      companyDebit: "",
      companyCredit: "",
      himayan: "",
    });
    setHighlighted({
      personalDebit: [],
      personalCredit: [],
      companyDebit: [],
      companyCredit: [],
      himayan: [],
    });

    localStorage.removeItem("companyCalculatorData");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-8">Company Daily Calculator</h1>

      {/* Clear All Data Button */}
      <button
        onClick={handleClearAll}
        className="mb-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-all"
      >
        🧹 Clear All Data
      </button>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full max-w-8xl">
        {Object.keys(data).map((section) => (
          <div key={section} className="bg-white shadow-lg rounded-2xl p-5">
            <h2 className="text-xl font-semibold capitalize mb-4 text-center">
              {section
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </h2>

            {/* Yesterday Balance */}
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Yesterday’s Balance
            </label>
            <input
              type="number"
              value={data[section].yesterday}
              onChange={(e) => handleYesterdayChange(section, e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:ring focus:ring-blue-200"
            />

            {/* Deposit Amount */}
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Add Deposit
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="number"
                value={newDeposit[section]}
                onChange={(e) =>
                  setNewDeposit({ ...newDeposit, [section]: e.target.value })
                }
                placeholder="Enter deposit amount"
                className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-green-200"
              />
              <button
                onClick={() => handleAddDeposit(section)}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
              >
                +
              </button>
            </div>

            {/* Today's Withdrawals */}
            <label className="block mb-2 text-sm font-medium text-gray-600">
              Add Today’s Withdrawal
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="number"
                value={newAmount[section]}
                onChange={(e) =>
                  setNewAmount({ ...newAmount, [section]: e.target.value })
                }
                placeholder="Enter amount"
                className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-200"
              />
              <button
                onClick={() => handleAddAmount(section)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg"
              >
                +
              </button>
            </div>

            {/* List of Withdrawals */}
            {data[section].withdrawals.length > 0 && (
              <ul className="mb-4 border rounded-lg p-2 bg-gray-50 max-h-32 overflow-y-auto">
                {data[section].withdrawals.map((amt, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center border-b last:border-b-0 py-1 px-2 rounded cursor-pointer transition-all duration-200 ${
                      highlighted[section]?.includes(index)
                        ? "bg-green-200"
                        : ""
                    }`}
                    onClick={() => toggleHighlight(section, index)}
                  >
                    <span>₹ {amt}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAmount(section, index);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Summary */}
            <div className="bg-gray-50 p-3 rounded-lg text-center">
              <p className="font-medium text-gray-700">
                Total Withdrawn:{" "}
                <span className="font-bold text-orange-600">
                  ₹ {getTotalWithdrawals(section)}
                </span>
              </p>
              <p className="mt-1 font-medium text-gray-700">
                Today’s Balance:{" "}
                <span className="font-bold text-blue-600">
                  ₹ {getTodayBalance(section)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Total Remaining Balance */}
      <div className="mt-10 p-4 bg-white rounded-2xl shadow-lg w-full max-w-md text-center">
        <h3 className="text-lg font-semibold mb-2">Total Remaining Balance</h3>
        <p className="text-2xl font-bold text-green-600">
          ₹
          {Object.keys(data)
            .reduce((sum, key) => sum + getTodayBalance(key), 0)
            .toFixed(2)}
        </p>
      </div>
    </div>
  );
}

export default App;
