import { useEffect, useState } from "react";
import API from "../services/api";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    const { data } = await API.get(
      `/transactions?page=${page}&search=${search}&category=${category}`
    );
    setTransactions(data.transactions);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchData();
  }, [page, search, category]);

  return (
    <div>
      <h2>Transaction Explorer</h2>

      <input
        placeholder="Search"
        onChange={e => setSearch(e.target.value)}
      />

      <select onChange={e => setCategory(e.target.value)}>
        <option value="">All</option>
        <option value="Food">Food</option>
        <option value="Travel">Travel</option>
        <option value="Rent">Rent</option>
      </select>

      {transactions.length === 0 && <p>No transactions found</p>}

      {transactions.map(t => (
        <div key={t._id}>
          {t.title} - ${t.amount} - {t.category}
        </div>
      ))}

      <button disabled={page === 1}
        onClick={() => setPage(page - 1)}>Prev</button>

      <button disabled={page === totalPages}
        onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
}
