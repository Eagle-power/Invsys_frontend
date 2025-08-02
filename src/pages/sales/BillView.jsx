// path: src/pages/sales/BillView.jsx
import { useEffect } from "react";
import { useLazyGetSaleByIdQuery } from "@/features/sales/salesApiSlice";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";

export default function BillView({ saleId }) {
  const [trigger, { data: sale, isLoading, isError }] =
    useLazyGetSaleByIdQuery();

  useEffect(() => {
    if (saleId) {
      trigger(saleId);
    }
  }, [saleId, trigger]);

  const handlePrint = () => {
    window.print();
  };
  useEffect(() => {
    if (sale) {
      console.log("Loaded Sale Data:", sale);
    }
  }, [sale]);

  if (isLoading) return <div className="p-6 text-center">Loading Bill...</div>;
  if (isError)
    return (
      <div className="p-6 text-center text-red-500">
        Could not load bill details.
      </div>
    );
  if (!sale) return null;

  return (
    <div className="text-sm text-gray-800" id="bill-to-print">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-bold text-blue-600">InvSys</h2>
            <p className="font-semibold">{sale[0]?.store?.name}</p>
            <p className="text-gray-600">{sale[0]?.store?.location}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-bold">INVOICE</h3>
            <p className="font-mono">{sale[0]?.invoiceNumber}</p>
            <p className="text-gray-600">
              Date:
              {isNaN(Date.parse(sale[0]?.createdAt))
                ? "N/A"
                : new Date(sale[0]?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold mb-1">Bill To:</h4>
            <p>{sale[0]?.customer?.name}</p>
            <p className="text-gray-600">{sale[0]?.customer?.phone}</p>
            <p className="text-gray-600">{sale[0]?.customer?.email || ""}</p>
          </div>
          <div className="text-right">
            <h4 className="font-semibold mb-1">Processed By:</h4>
            <p>{sale[0]?.staff?.name}</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left font-semibold">Item</th>
                <th className="p-2 text-center font-semibold">Qty</th>
                <th className="p-2 text-right font-semibold">Price</th>
                <th className="p-2 text-right font-semibold">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {sale[0]?.items?.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2">
                    {item?.name} ({item?.sku})
                  </td>
                  <td className="p-2 text-center">{item?.quantity}</td>
                  <td className="p-2 text-right">
                    ₹{(item?.price || 0).toFixed(2)}
                  </td>
                  <td className="p-2 text-right">
                    ₹{((item?.price || 0) * (item?.quantity || 0)).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="w-64">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              {/* FIX: Add a fallback of 0 before calling toFixed */}
              <span>₹{(sale[0]?.totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t flex justify-end">
        <Button
          onClick={handlePrint}
          className="bg-gradient-to-r from-blue-600 to-violet-600"
        >
          <Printer className="mr-2 h-4 w-4" />
          Print Bill
        </Button>
      </div>
    </div>
  );
}
