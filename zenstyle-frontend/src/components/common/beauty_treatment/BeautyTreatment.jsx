import { useState, useEffect } from "react";
import { ServiceCard } from "@/ui";
import { getBeautyTreatment } from "@/services/api";

export default function Haircutting() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBeautyTreatment()
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-80 bg-gray-100 animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <ServiceCard
          key={item.id}
          item={item}
          moreInfoLink="/san-pham/beauty-treatment"
        />
      ))}
    </div>
  );
}
