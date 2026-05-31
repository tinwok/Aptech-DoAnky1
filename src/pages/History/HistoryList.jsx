function HistoryList() {
  const histories = [
    {
      id: 1,
      customer: "Nguyễn Văn A",
      service: "Cắt tóc nam",
      barber: "Minh",
      date: "30/05/2026",
      price: 80000,
    },
    {
      id: 2,
      customer: "Trần Văn B",
      service: "Cắt + Gội",
      barber: "Hùng",
      date: "29/05/2026",
      price: 120000,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>History Services</h1>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Service</th>
            <th>Barber</th>
            <th>Date</th>
            <th>Price</th>
          </tr>
        </thead>

        <tbody>
          {histories.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.customer}</td>
              <td>{item.service}</td>
              <td>{item.barber}</td>
              <td>{item.date}</td>
              <td>{item.price.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistoryList;
