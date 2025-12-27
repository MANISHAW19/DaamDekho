import FirecrawlApp from "@mendable/firecrawl-js";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY,
});

export async function scrapeProduct(url) {
  try {
    const result = await firecrawl.scrape(url, {
      formats: [
        {
            type:"json",
            schema: {
                type: "object",
                required: ["productName", "currentPrice"],
                properties: {
                    productName: { 
                        type: "string" 
                    },
                    currentPrice: {
                         type: "number" 
                    },
                    currencyCode: { 
                        type: "string"
                    },
                    productImageUrl: { 
                        type: "string" 
                    },
                },
            },

            prompt: "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD,EUR,etc) as 'currencyCode', and product image URL as 'productImageUrl' is available.",
        },
      ],
    });

    console.log("🔥 FIRECRAWL RESULT:", result);

    // Firecrawl returns data in result.extract
    const extractedData = result.json || {};

    const product = {
      productName: extractedData.productName ?? "",
      currentPrice: extractedData.currentPrice ?? null,
      currencyCode: extractedData.currencyCode ?? null,
      productImageUrl: extractedData.productImageUrl ?? null,
    };


    if (!product.productName || !product.currentPrice) {
      throw new Error("Failed to extract product details");
    }

    return product;
  } catch (error) {
    console.error("Firecrawl scrape error:", error);
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}