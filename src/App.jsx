import { useState, useEffect } from "react";
import ProductList from "./pages/Inventory/ProductList";
import TransactionList from "./pages/Inventory/TransactionList";

function App() {
  const [page, setPage] = useState("transactions");
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Wax Romano",
            category: "Wax",
            importQty: 50,
            exportQty: 25,
            stock: 25,
            date: "31/05/2026",
            price: 150000,
          },

          {
            id: 2,
            name: "Gel X-Men",
            category: "Gel",
            price: 120000,
            stock: 40,
          },
        ];
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");

    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            product: "Wax Romano",
            type: "IMPORT",
            quantity: 50,
            price: 0,
            date: "30/05/2026",
            note: "Nhập kho",
          },

          {
            id: 2,
            product: "Wax Romano",
            type: "EXPORT",
            quantity: 25,
            price: 0,
            date: "31/05/2026",
            note: "Bán cho khách",
          },
        ];
  });
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  return (
    <div>
      <div className="container mt-3 text-center">
        <button
          className="btn btn-primary me-2"
          onClick={() => setPage("products")}
        >
          Products
        </button>

        <button
          className="btn btn-success"
          onClick={() => setPage("transactions")}
        >
          Transactions
        </button>
      </div>

      {page === "products" && (
        <ProductList
          products={products}
          setProducts={setProducts}
          transactions={transactions}
        />
      )}

      {page === "transactions" && (
        <TransactionList
          products={products}
          setProducts={setProducts}
          transactions={transactions}
          setTransactions={setTransactions}
        />
      )}
    </div>
  );
}

export default App;
