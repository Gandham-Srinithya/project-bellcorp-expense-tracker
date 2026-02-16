import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    API.get("/transactions?limit=5").then(res => {
      setTransactions(res.data.transactions);
      const sum = res.data.transactions.reduce(
        (acc, t) => acc + t.amount,
        0
      );
      setTotal(sum);
    });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Total (Recent 5): ${total}</h2>

      <Link to="/transactions">Go to Transactions</Link>

      {transactions.map(t => (
        <div key={t._id}>
          {t.title} - ${t.amount} - {t.category}
        </div>
      ))}
    </div>
  );
}
