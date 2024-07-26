import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchProducts } from "../util/http";
import { ProgressSpinner } from "primereact/progressspinner";
import Card from "../ui/Card";
import { categories } from "../App";
import FilterTab from "../ui/FilterTab";
import { useDispatch, useSelector } from "react-redux";
import image from '../assets/noProductFound.png'
import { addSortBy } from "../store/ui-slice";
import { useState } from "react";

export default function ShopPage() {
  const [searchParams, setSearchParans] = useSearchParams();
  const mode = searchParams.get("mode");
  const filters = useSelector(state => state.ui.filters);
  const sortBy = useSelector(state => state.ui.sortBy);
  const [sort, setSort] = useState(sortBy)
  const dispatch = useDispatch();
  const {
    data: products,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["products", filters, sortBy],
    queryFn: ({signal}) => fetchProducts({signal, filters, sortBy}),
  });


  function handleSortChange(e) {
    const sortBy = e.target.value;
    dispatch(addSortBy(sortBy));
  }
  return (
    <>
    <header className="absolute top-[12rem] right-[4rem]">
      <div className="flex gap-1 items-center">
        <h3 className="poppins-semibold">Sort By</h3>
      <select name="sort" id="sort" onChange={handleSortChange} className="border-2 border-myGreen-light rounded-md poppins-regular p-1 text-sm">
        <option value="" selected={sort == ''}>None</option>
        <option value="price" selected={sort == 'price'} >Price: Low to High</option>
        <option value="-price" selected={sort == '-price'}>Price: High to Low</option>
        <option value="-averageRating" selected={sort == '-averageRating'}>Rating</option>
        <option value="-ordersQuantity" selected={sort == '-ordersQuantity'}>Popularity</option>
      </select>
      </div>
      
    </header>
    <div className="mt-[14rem] flex  gap-2 pb-[8rem]">
      <aside className="w-[20%] bg-white h-screen">
        <FilterTab />
      </aside>


      <main className="w-[80%] h-screen overflow-y-scroll">
        {isPending && (
          <div className="h-screen w-full flex justify-center items-center">
            <ProgressSpinner
              style={{ width: "50px", height: "50px" }}
              strokeWidth="8"
              fill="white"
              animationDuration=".5s"
              className="custom-spinner"
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
        {
          !isPending && products.length < 1 && (
            <div className="h-screen w-full flex flex-col justify-center items-center bg-white">
                <img src={image} alt="" className="w-[50%] "/>
                <h1 className="poppins-bold text-xl">No Products Found</h1>
            </div>
        )
        }
      </main>
    </div>
    </>
  );
}
