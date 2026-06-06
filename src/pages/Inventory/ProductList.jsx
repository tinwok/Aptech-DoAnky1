import { useState } from "react";

function ProductList({ products, setProducts, transactions }) {
  const [name, setName] = useState("");
  const [supplier, setSupplier] = useState("");
  const [importPrice, setImportPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [importQty, setImportQty] = useState("");
  const [exportQty, setExportQty] = useState("");
  const [stock, setStock] = useState("");
  const [date, setDate] = useState("");

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const deleteProduct = (id) => {
    if (window.confirm("Delete this product?")) {
      setProducts(products.filter((item) => item.id !== id));
    }
  };
  const editProduct = (product) => {
    setEditId(product.id);

    setName(product.name || "");
    const [supplier, setSupplier] = useState("");

    setImportQty(product.importQty || 0);

    setExportQty(product.exportQty || 0);

    setStock(product.stock || 0);

    setDate(product.date || "");

    setImportPrice(product.importPrice || 0);

    setSalePrice(product.salePrice || 0);
  };
  const addProduct = () => {
    if (!name || !quantity || !importPrice || !salePrice) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    const newProduct = {
      id: products.length + 1,
      name,
      supplier,
      stock: Number(quantity),
      importQty: 0,
      exportQty: 0,
      date: "-",
      importPrice: Number(importPrice),
      salePrice: Number(salePrice),
    };

    setProducts([...products, newProduct]);

    setName("");
    setSupplier("");
    setQuantity("");
    setImportPrice("");
    setSalePrice("");
  };
  const updateProduct = () => {
    const updatedProducts = products.map((item) =>
      item.id === editId
        ? {
            ...item,

            name: name,

            supplier: supplier,

            importQty: Number(importQty),

            exportQty: Number(exportQty),

            stock: Number(stock),

            date: date,

            importPrice: Number(importPrice),

            salePrice: Number(salePrice),
          }
        : item,
    );

    setProducts(updatedProducts);

    setEditId(null);

    setName("");
    setImportQty("");
    setExportQty("");
    setStock("");
    setDate("");
    setImportPrice("");
    setSalePrice("");
  };

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalQuantity = products.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0,
  );
  const calculateProfit = (item) => {
    const productTransactions = transactions.filter(
      (t) => t.product === item.name,
    );

    let totalImport = 0;
    let totalExport = 0;

    productTransactions.forEach((t) => {
      if (t.type === "IMPORT") {
        totalImport += Number(t.quantity || 0) * Number(t.price || 0);
      }

      if (t.type === "EXPORT") {
        totalExport += Number(t.quantity || 0) * Number(t.price || 0);
      }
    });

    const stockValue = Number(item.stock || 0) * Number(item.importPrice || 0);

    return totalExport - totalImport + stockValue;
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Inventory Management</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="🔍 Search Product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <h5>
          Total Products: {filteredProducts.length}
          Total Quantity: {totalQuantity}
        </h5>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label className="fw-bold">Product Name</label>
        <input
          type="text"
          className="form-control mb-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="fw-bold">Import Quantity</label>
        <input
          type="number"
          className="form-control mb-2"
          value={importQty}
          onChange={(e) => setImportQty(e.target.value)}
        />

        <label className="fw-bold">Export Quantity</label>
        <input
          type="number"
          className="form-control mb-2"
          value={exportQty}
          onChange={(e) => setExportQty(e.target.value)}
        />
        <label className="fw-bold">Current Stock</label>
        <input
          type="number"
          className="form-control mb-2"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <label className="fw-bold">Last Update Date</label>
        <input
          type="date"
          className="form-control mb-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br />
        <br />

        <br />
        <br />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Import Price"
          value={importPrice}
          onChange={(e) => setImportPrice(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Sale Price"
          value={salePrice}
          onChange={(e) => setSalePrice(e.target.value)}
        />

        <br />
        <br />
      </div>

      {editId ? (
        <button onClick={updateProduct}>Update Product</button>
      ) : (
        <button className="btn btn-success" onClick={addProduct}>
          Add Product
        </button>
      )}

      <br />
      <br />

      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Supplier</th>
            <th>Import</th>
            <th>Export</th>
            <th>Stock</th>
            <th>Date</th>
            <th>Import Price</th>
            <th>Sale Price</th>
            <th>Profit</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.supplier || "-"}</td>
              <td>{item.importQty || 0}</td>
              <td>{item.exportQty || 0}</td>
              <td>{item.stock}</td>
              <td>{item.date || "-"}</td>

              <td>{Number(item.importPrice || 0).toLocaleString()}đ</td>

              <td>{Number(item.salePrice || 0).toLocaleString()}đ</td>

              <td>{calculateProfit(item).toLocaleString()}đ</td>
              <td>
                {item.stock < 10 ? (
                  <span className="badge bg-danger">Low Stock</span>
                ) : (
                  <span className="badge bg-success">Normal</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => editProduct(item)}
                >
                  Edit
                </button>{" "}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProduct(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;
