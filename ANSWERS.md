 # Answers

## 1.

In the current implementation, `OrdersService` stores data in the in-memory `ORDERS` array inside `server/src/orders/orders.service.ts`. This is fine for a demo, but in a production QDC system it would cause data loss on server restarts and would not work well with multiple application instances. I would replace the in-memory array with a database such as PostgreSQL and introduce a repository/data access layer. The service would focus on business logic while repositories would handle persistence.

For a system with thousands of orders and concurrent users, I would also add database indexes on frequently queried fields such as `orderId`, customer information, and garment status. Operations that update multiple records should be wrapped in transactions to ensure consistency. This separation would make the application more scalable, testable, and maintainable as the business grows.

## 2.

The current `GET /api/orders/:id` endpoint returns either an `Order` object or an `{ error: string }` object. The advantage of this approach is that it is simple and easy to understand in a small application. However, clients must handle multiple response shapes, which can become difficult as the API grows.

In a real-world POS system, I would use NestJS exceptions such as `NotFoundException` instead of returning custom error objects. This would allow the API to return proper HTTP status codes like `404 Not Found` and provide a consistent error structure across all endpoints. Consistent API contracts make frontend integration easier and improve debugging, monitoring, and documentation.

## 3.

Currently, `client/src/App.tsx` fetches data directly inside a `useEffect` using `fetch('http://localhost:3001/api/orders')`. This works for a small page, but it can become difficult to maintain when adding filters, pagination, sorting, and multiple API calls.

I would move API communication into a dedicated layer, for example an `api` or `services` directory, and create reusable functions such as `getOrders()` and `getOrderById()`. For larger applications, I would use React Query or a similar library to handle caching, loading states, retries, and background refetching. Components would focus on rendering UI while data-fetching logic would remain centralized and easier to test.

## 4.

The current domain model is intentionally simple. `Order` only contains `id`, `customerName`, `createdAt`, and a list of garments, while `Garment` only contains `id`, `description`, and `status`. In a real laundry business, additional information would be required to support operational workflows.

For example, orders may need customer contact details, billing information, payment status, delivery preferences, pickup dates, special instructions, and audit timestamps. Garments may need quantity, category, stain notes, photos, pricing, processing history, and tracking information showing when a garment moved from one status to another. I would evolve the model incrementally while keeping business rules centralized inside the service layer to avoid spreading workflow logic throughout the application.

## 5.

AI-generated code can accelerate development, but it may introduce subtle issues that are not immediately obvious. For example, generated code may ignore edge cases, duplicate logic, use inconsistent naming conventions, or introduce performance and security problems. In this project, an AI-generated implementation could easily overlook routing conflicts, invalid input handling, or incorrect business assumptions.

Before shipping to production, I would review the generated code manually, verify that it follows project conventions, and write tests for important business logic. I would also perform API testing, check edge cases, run linting and type-checking tools, and validate that the implementation matches the actual business requirements rather than only appearing correct at first glance. AI can help with implementation speed, but human review remains essential for reliability.

## 6.

For near real-time garment updates, I would keep the existing REST endpoints for standard CRUD operations and introduce WebSockets using NestJS Gateways. Whenever a garment status changes, the backend could emit an event to connected clients, allowing the dashboard to update immediately without requiring a page refresh.

An alternative would be periodic polling from the frontend, which is simpler to implement but generates unnecessary requests and introduces delays. WebSockets provide a better user experience for operational dashboards because updates appear instantly, but they also increase infrastructure complexity and require connection management. For a growing QDC platform where staff actively monitor garment progress, I would prefer WebSockets while continuing to use REST APIs for standard data access.
