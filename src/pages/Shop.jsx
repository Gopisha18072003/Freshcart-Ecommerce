import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../util/http";
import { ProgressSpinner } from "primereact/progressspinner";
import Card from "../ui/Card";
import { categories } from "../App";
import MultipleSelect from "../ui/MultiSelect";

export default function ShopPage() {
  const [searchParams, setSearchParans] = useSearchParams();
  const mode = searchParams.get("mode");
  console.log(mode);
  const {
    data: products,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const filterOptions = [
    { name: 'Category', options: categories },
    { name: 'Price'},
    { name: 'Discount'},
    {name: 'Organic'},
    {name: "In stocks"}
  ]

  return (
    <div className="mt-[10rem] pb-[2rem] flex ">
      <aside className="w-[20%] bg-white h-screen">
        <h1>Filters</h1>
        
      </aside>


      <main className="w-[80%] h-screen overflow-y-scroll">
        {isPending && (
          <div className="h-screen w-full">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="white"
              animationDuration=".5s"
            />
          </div>
        )}
        {
            !isPending && products && (
                <ul className="grid grid-cols-4 ">
                    {
                        products.map((product) => <li key={product.name}><Card data={product} /></li>)
                    }
                </ul>
            )
        }
      </main>
    </div>
  );
}
