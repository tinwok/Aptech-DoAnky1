import { useState } from "react";

function ProductList({ products, setProducts, transactions }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const deleteProduct = (id) => {
    const newProducts = products.filter((item) => item.id !== id);
    if (quantity <= 0) {
      alert("Quantity must be greater than 0");
      return;
    }

    if (price <= 0) {
      alert("Price must be greater than 0");
      return;
    }

    setProducts(newProducts);
  };
  const editProduct = (product) => {
    setEditId(product.id);

    setName(product.name);
    setCategory(product.category);
    setQuantity(product.stock || 0);
    setPrice(product.price);
  };

  const addProduct = () => {
    if (!name || !category || !quantity || !price) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    const newProduct = {
      id: products.length + 1,
      name,
      category,
      quantity,
      price,
    };

    setProducts([...products, newProduct]);

    setName("");
    setCategory("");
    setQuantity("");
    setPrice("");
  };
  const updateProduct = () => {
    const updatedProducts = products.map((item) =>
      item.id === editId
        ? {
            ...item,
            name,
            category,
            quantity,
            price,
          }
        : item,
    );

    setProducts(updatedProducts);

    setEditId(null);
    setName("");
    setCategory("");
    setQuantity("");
    setPrice("");
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
      const value = Number(t.quantity || 0) * Number(t.price || 0);

      if (t.type === "IMPORT") {
        totalImport += value;
      }

      if (t.type === "EXPORT") {
        totalExport += value;
      }
    });

    const stockValue = Number(item.stock || 0) * Number(item.price || 0);

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
        <input
          type="text"
          className="row justify-content-center"
          className="col-md-4"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

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
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
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
            <th>Category</th>
            <th>Import</th>
            <th>Export</th>
            <th>Stock</th>
            <th>Date</th>
            <th>Price</th>
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
              <td>{item.category}</td>
              <td>{item.importQty || 0}</td>
              <td>{item.exportQty || 0}</td>
              <td>{item.stock}</td>
              <td>{item.date || "-"}</td>
              <td>{Number(item.price || 0).toLocaleString()}đ</td>

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
