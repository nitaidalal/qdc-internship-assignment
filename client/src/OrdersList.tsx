import React from 'react';
import type { Order } from './App';

interface Props {
  orders: Order[];
  selectedStatus:
    | 'all'
    | 'received'
    | 'in_cleaning'
    | 'ready'
    | 'delivered';
}

const statusLabel: Record<string, string> = {
  received: 'Received',
  in_cleaning: 'In Cleaning',
  ready: 'Ready for Pickup',
  delivered: 'Delivered',
};

const statusColor: Record<string, string> = {
  received: "#2563eb",
  in_cleaning: "#d97706",
  ready: "#16a34a",
  delivered: "#6b7280",
};

export const OrdersList: React.FC<Props> = ({
  orders,
  selectedStatus,
}) => {
  const filteredOrders = orders
    .map((order) => ({
      ...order,
      garments:
        selectedStatus === 'all'
          ? order.garments
          : order.garments.filter(
              (g) => g.status === selectedStatus
            ),
    }))
    .filter((order) => order.garments.length > 0);

  if (orders.length === 0) {
    return <p>No active orders.</p>;
  }

  if (filteredOrders.length === 0) {
    return (
      <p>
        No garments found for the selected status.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {filteredOrders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <strong>{order.id}</strong>
            <span>{order.customerName}</span>
          </div>

          <small>Created: {new Date(order.createdAt).toLocaleString()}</small>

          <ul>
            {order.garments.map((g) => (
              <li
                key={g.id}
                style={{
                  marginBottom: "0.5rem",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>{g.description}</span>

                <span
                  style={{
                    backgroundColor: statusColor[g.status],
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "0.8rem",
                  }}
                >
                  {statusLabel[g.status]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};