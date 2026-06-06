import React, { useEffect, useState } from "react";
import { OrdersList } from "./OrdersList";

export interface Garment {
  id: string;
  description: string;
  status: "received" | "in_cleaning" | "ready" | "delivered";
}

export interface Order {
  id: string;
  customerName: string;
  createdAt: string;
  garments: Garment[];
}

type SelectedStatus =
  | "all"
  | "received"
  | "in_cleaning"
  | "ready"
  | "delivered";

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<SelectedStatus>("all");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:3001/api/orders");

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = (await res.json()) as Order[];
        setOrders(data);
      } catch (e: any) {
        setError(e.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "sans-serif",
        backgroundColor: "#f4f6f8",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            margin: 0,
            color: "#1f2937",
          }}
        >
          QDC Mini Dashboard
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginTop: "0.5rem",
          }}
        >
          Manage orders and track garment processing status.
        </p>
      </div>

      {loading && <p>Loading orders...</p>}

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <div
            style={{
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <label
              style={{
                fontWeight: 600,
                color: "#374151",
              }}
            >
              Filter Status:
            </label>

            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as SelectedStatus)
              }
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                cursor: "pointer",
              }}
            >
              <option value="all">All</option>
              <option value="received">Received</option>
              <option value="in_cleaning">In Cleaning</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <OrdersList orders={orders} selectedStatus={selectedStatus} />
        </>
      )}
    </div>
  );
};
