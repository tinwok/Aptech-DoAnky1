import { useState } from "react";
function TransactionList({
  products,
  setProducts,
  transactions,
  setTransactions,
}) {
  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [type, setType] = useState("IMPORT");
  const [quantity, setQuantity] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  const addTransaction = () => {
    if (!product || !quantity || !date) {
      alert("Please fill all required fields");
      return;
    }

    const currentStock = stockSummary[product] || 0;

    if (type === "EXPORT" && Number(quantity) > currentStock) {
      alert("Số lượng không đủ xuất kho");
      return;
    }

    const newTransaction = {
      id: transactions.length + 1,

      product,

      supplier,

      type,

      quantity,

      price: Number(price),

      date,

      note,
    };

    setTransactions([...transactions, newTransaction]);

    const existingProduct = products.find((item) => item.name === product);

    if (existingProduct) {
      const updatedProducts = products.map((item) => {
        if (item.name !== product) {
          return item;
        }

        return {
          ...item,

          importQty:
            type === "IMPORT"
              ? (item.importQty || 0) + Number(quantity)
              : item.importQty || 0,

          exportQty:
            type === "EXPORT"
              ? (item.exportQty || 0) + Number(quantity)
              : item.exportQty || 0,

          stock:
            type === "IMPORT"
              ? (item.stock || 0) + Number(quantity)
              : (item.stock || 0) - Number(quantity),

          date: date,

          importPrice:
            type === "IMPORT" ? Number(price) : item.importPrice || 0,

          salePrice: type === "EXPORT" ? Number(price) : item.salePrice || 0,
        };
      });

      setProducts(updatedProducts);
      return;
    } else {
      const newProduct = {
        id: products.length + 1,

        name: product,

        importQty: type === "IMPORT" ? Number(quantity) : 0,

        exportQty: type === "EXPORT" ? Number(quantity) : 0,

        stock: type === "IMPORT" ? Number(quantity) : 0,

        date: date,

        importPrice: type === "IMPORT" ? Number(price) : 0,

        salePrice: type === "EXPORT" ? Number(price) : 0,
      };
      setProducts([...products, newProduct]);
    }

    setProduct("");
    setType("IMPORT");
    setQuantity("");
    setDate("");
    setNote("");
    setPrice("");
  };
  const editTransaction = (item) => {
    setEditId(item.id);

    setProduct(item.product);

    setType(item.type);

    setQuantity(item.quantity);

    setDate(item.date);

    setPrice(item.price);

    setNote(item.note);
  };

  const updateTransaction = () => {
    const updatedTransactions = transactions.map((row) =>
      row.id === editId
        ? {
            ...row,

            product,

            supplier: supplier,

            type,

            quantity,

            date,

            price,

            note,
          }
        : row,
    );

    setTransactions(updatedTransactions);

    setEditId(null);

    setProduct("");

    setType("IMPORT");

    setQuantity("");

    setDate("");

    setPrice("");

    setNote("");
  };

  const stockSummary = {};
  transactions.forEach((item) => {
    if (!stockSummary[item.product]) {
      stockSummary[item.product] = 0;
    }

    if (item.type === "IMPORT") {
      stockSummary[item.product] += Number(item.quantity);
    } else {
      stockSummary[item.product] -= Number(item.quantity);
    }
  });
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Inventory Transactions</h1>
      <div className="card mb-4">
        <div className="card-header">Current Stock</div>

        <div className="card-body">
          {Object.entries(stockSummary).map(([product, stock]) => (
            <p key={product}>
              <strong>{product}</strong> :{" "}
              {
                <>
                  {stock}

                  {stock < 10 && (
                    <span className="badge bg-danger ms-2">Low Stock</span>
                  )}
                </>
              }
            </p>
          ))}
        </div>
      </div>
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Product Name"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          />
          <select
            className="form-select mb-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="IMPORT">IMPORT</option>
            <option value="EXPORT">EXPORT</option>
          </select>
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input
            type="date"
            className="form-control mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            className="form-control mb-2"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {editId ? (
            <button className="btn btn-warning" onClick={updateTransaction}>
              Update Transaction
            </button>
          ) : (
            <button className="btn btn-primary" onClick={addTransaction}>
              Add Transaction
            </button>
          )}
        </div>
      </div>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Supplier</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Date</th>
            <th>Price</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.product}</td>
              <td>{item.supplier || "-"}</td>
              <td>{item.type}</td>
              <td>{item.quantity}</td>
              <td>{item.date}</td>

              <td>{Number(item.price || 0).toLocaleString()}đ</td>

              <td>{item.note}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => editTransaction(item)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionList;
