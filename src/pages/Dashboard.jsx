import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/features/auth/authSlice";
import { useGetDashboardStatsQuery } from "@/features/dashboard/dashboardApiSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, Box, ShoppingCart, UserPlus } from "lucide-react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function Dashboard() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading, isError, error } = useGetDashboardStatsQuery();

  if (isLoading)
    return <p className="text-center py-10">Loading dashboard...</p>;
  if (isError)
    return (
      <p className="text-red-500 text-center py-10">
        Error loading dashboard data: {error.data?.message}
      </p>
    );
  if (!data)
    return <p className="text-center py-10">No dashboard data available.</p>;

  const vibrantColors = ["#5E60CE", "#4EA8DE", "#34D399", "#F59E0B", "#EF4444"];
  const salesChartData = {
    labels:
      data.salesLast7Days?.map((d) =>
        new Date(d._id).toLocaleDateString("en-US", { weekday: "short" })
      ) || [],
    datasets: [
      {
        label: "Revenue (₹)",
        data: data.salesLast7Days?.map((d) => d.totalAmount) || [],
        backgroundColor: vibrantColors[1],
        borderColor: vibrantColors[1],
        borderRadius: 4,
      },
    ],
  };
  const topProductsChartData = {
    labels: data.topSellingProducts?.map((p) => p._id) || [],
    datasets: [
      {
        label: "Units Sold",
        data: data.topSellingProducts?.map((p) => p.totalQuantity) || [],
        backgroundColor: vibrantColors,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };
  const monthlySalesData = {
    labels: data.monthlySales?.map((d) => `${d._id.month}/${d._id.year}`) || [],
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: data.monthlySales?.map((d) => d.totalAmount) || [],
        borderColor: "#5E60CE",
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(0, "rgba(94, 96, 206, 0.5)");
          gradient.addColorStop(1, "rgba(94, 96, 206, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#5E60CE",
        pointBorderColor: "#fff",
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: false } },
  };

  const isAdmin = user?.role === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          {isAdmin
            ? "Admin Dashboard"
            : `${user.assignedStore?.name || "Store"} Dashboard`}
        </h1>
        <p className="text-gray-600">
          {isAdmin
            ? "An overview of your entire business performance."
            : `An overview of performance for your store.`}
        </p>
      </div>

      {/* KPI Cards */}
      <div
        className={`grid gap-6 sm:grid-cols-2 ${
          isAdmin ? "lg:grid-cols-5" : "lg:grid-cols-3"
        }`}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{data.kpis.totalRevenue.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales Today</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{data.kpis.salesToday.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{data.kpis.totalSales.toLocaleString("en-IN")}
            </div>
          </CardContent>
        </Card>
        {/* Admin-only KPIs */}
        {isAdmin && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  +{data.kpis.totalCustomers.toLocaleString("en-IN")}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Box className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.kpis.totalProducts}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Sales Revenue (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <Bar options={chartOptions} data={salesChartData} />
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top 5 Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <Doughnut options={chartOptions} data={topProductsChartData} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin-only Chart */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>All-Time Sales Performance</CardTitle>
            <CardDescription>
              Monthly revenue growth over the lifetime of the business.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 relative">
              <Line options={lineChartOptions} data={monthlySalesData} />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
          <CardDescription>
            The last 5 transactions for this store.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                {isAdmin && <TableHead>Store</TableHead>}
                <TableHead>Customer</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentSales?.map((sale) => (
                <TableRow key={sale._id}>
                  <TableCell className="font-mono">
                    {sale.invoiceNumber}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>{sale.store?.name || "N/A"}</TableCell>
                  )}
                  <TableCell>{sale.customer?.name || "N/A"}</TableCell>
                  <TableCell className="text-right font-semibold">
                    ₹{sale.totalAmount.toLocaleString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
