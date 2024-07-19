import React, { useState, useEffect } from "react";
import { Carousel } from "primereact/carousel";
import Card from "./Card";


export default function CircularCarousel({ avbProducts, max }) {
  const [products, setProducts] = useState(avbProducts);
  let maxVisible = 5;
  if(max) {
    maxVisible = max;
  }
  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: maxVisible,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];

  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };

  const productTemplate = (product) => {
    return (
      <Card data={product}/>
    );
  };

  return (
    <div className="card">
      <Carousel
        value={products}
        numVisible={3}
        numScroll={3}
        responsiveOptions={responsiveOptions}
        className="custom-carousel mt-12"
        circular
        autoplayInterval={3000}
        itemTemplate={productTemplate}
      />
    </div>
  );
}
