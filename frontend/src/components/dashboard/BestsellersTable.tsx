import type { Bestseller } from "../../types/index";
import Card from "../ui/Card";

type Props = { items: Bestseller[] };

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function BestsellersTable({ items }: Props) {
  return (
    <Card padding="lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-headline italic font-bold">Atelier Bestsellers</h2>
        <span className="text-xs font-label text-primary hover:underline cursor-pointer tracking-wider uppercase">
          View Full Catalog
        </span>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {["Product Name", "Price", "# Units Sold", "Revenue"].map(col => (
              <th key={col} className="text-left pb-3 font-label text-xs uppercase tracking-widest text-secondary/40 font-medium">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={i}
              className="border-b border-white/[0.03] hover:bg-surface-container-highest/40 transition-colors"
            >
              <td className="py-4 font-headline italic font-semibold text-on-surface">{item.name}</td>
              <td className="py-4 text-secondary/80 font-label">{fmt(item.price)}</td>
              <td className="py-4 text-secondary/80 font-label">{item.units_sold.toLocaleString()}</td>
              <td className="py-4 text-tertiary font-label font-semibold">{fmt(item.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {items.length === 0 && (
        <p className="text-center text-secondary/40 py-8 font-label">No sales data yet</p>
      )}
    </Card>
  );
}
