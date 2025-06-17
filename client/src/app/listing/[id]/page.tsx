import { Suspense } from "react";
import ProductDetailsSkeleton from "./productSkeleton";
import ProductDetailsContent from "./productDetails";

async function ProductDetailsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return (
    <Suspense fallback={<ProductDetailsSkeleton />}>
      <ProductDetailsContent id={params.id} />
    </Suspense>
  );
}

export default ProductDetailsPage;


