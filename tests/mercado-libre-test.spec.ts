import { test, expect } from '@playwright/test';

test('Top 5 products with filters new, CDMX and order desc', async ({ page }, testResults) => {
  //Increase the timeout for the test due to the amount of steps and screenshoots
  test.setTimeout(60000);

  await test.step("Enter the website and select Mexico as country",async()=>{
    await page.goto('https://www.mercadolibre.com');
    await page.locator('a#MX', {hasText: "México"}).click();
    const screenshot = await page.screenshot();
    testResults.attach("Step 1 - Select country", {contentType: 'image/png', body: screenshot});
  });

  await test.step("Search for playstation 5",async()=>{
    const input = page.locator('#cb1-edit');
    await input.waitFor();
    await input.fill('playstation 5');
    await page.locator('button[class="nav-search-btn"]').click();
    const screenshot = await page.screenshot();
    testResults.attach("Step 2 - Search by", {contentType: 'image/png', body: screenshot});
  });

  await test.step("Filter by New on condition",async()=>{
    const parentDivCondition=page.locator('h3.ui-search-filter-dt-title',{hasText: "Condición"}).locator('..');
    await parentDivCondition.locator('span.ui-search-filter-name',{hasText: "Nuevo"}).locator('..').click();
    const screenshot = await page.screenshot();
    testResults.attach("Step 3 - Filter by condition", {contentType: 'image/png', body: screenshot});
  });

  await test.step("Filter by CDMX on location",async()=>{
    const parentDivLocation=page.locator('h3.ui-search-filter-dt-title',{hasText: "Ubicación"}).locator('..');
    await parentDivLocation.locator('span.ui-search-filter-name',{hasText: "Distrito Federal"}).locator('..').click();
    const screenshot = await page.screenshot();
    testResults.attach("Step 4 - Filter by location", {contentType: 'image/png', body: screenshot});
  });
  
  
  await test.step("Wait for the tooltip to be focus in so we can click on Order by without loosing focus and closing the dropdown",async()=>{
    page.locator('.onboarding-cp-tooltip').waitFor();
    await page.waitForTimeout(2000);
    const screenshot = await page.screenshot();
    testResults.attach("Step 5 - Focus out tooltip", {contentType: 'image/png', body: screenshot});
  });

  await test.step("Order by price desc",async()=>{
    await page.getByRole('button',{name:"Más relevantes"}).click();
    await page.locator('li[data-key="price_desc"]').click();
    await page.waitForTimeout(2000);
    const screenshot = await page.screenshot();
    testResults.attach("Step 6 - Order by desc", {contentType: 'image/png', body: screenshot});
  });

  //Declare the variable for storage
  let first5Products:Array<{productName,productPrice}>=[];

  await test.step("Get the product characteristics of the first 5 products",async()=>{
    for (let i = 0; i < 5; i++) {
      const containerResult = page.locator('div.ui-search-result__content-wrapper').nth(i);
      const productName = await containerResult.locator('a.ui-search-link__title-card').innerText();
      const screenshotTitle = await page.screenshot();
      testResults.attach("Step 7 - Product title"+(i+1), {contentType: 'image/png', body: screenshotTitle});
      const productPriceSymbol = await containerResult.locator('.ui-search-price--size-medium .andes-money-amount__currency-symbol').first().innerText();
      const screenshotPrice = await page.screenshot();
      testResults.attach("Step 7 - Product currency"+(i+1), {contentType: 'image/png', body: screenshotPrice});
      const productPriceFraction = await containerResult.locator('.ui-search-price--size-medium .andes-money-amount__fraction').first().innerText();
      const screenshotAmount = await page.screenshot();
      testResults.attach("Step 7 - Product amount"+(i+1), {contentType: 'image/png', body: screenshotAmount});
      const productPrice = productPriceSymbol + productPriceFraction;

      first5Products.push({
        productName:productName,
        productPrice:productPrice
      });
    }
  });

  //Print the first 5 products
  console.log(first5Products)

  //Assert that the first 5 products are 5
  expect(first5Products).toHaveLength(5);
});