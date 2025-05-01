// import puppeteer
// Based on professor's code
const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });

  //   go to the site to be tested
  const page = await browser.newPage();

  await page.goto("https://college-coolers.web.app/home.html");

  // click on the sign-in button
  await page.click("#signin");

  //   provide email and pasword to sign in

  await page.type("#signin_email", "admin@a.com");
  await page.type("#signin_pw", "111111");

  // click on the submit button

  await page.click("#signinForm > div:nth-child(3) > div > button");

  await new Promise((r) => setTimeout(r, 1000));
  //testing admin page edit form
  await page.click("#admin_page_btn");

  await page.click("#update_0");
  await page.click("#update_a_order_semester");
  // await page.click("#update_a_order_semester > option:nth-child(2)");
  await page.type("#update_a_address", "111111");
  await page.type("#update_a_apt_no", "23");
  await page.type("#update_a_num_roommates", "3");
  //testing roommates name based on num of roommates
  for (let i = 1; i <= 3; i++) {
    await page.type(`#update_a_name_roommate_${i}`, "john");
  }
  await page.type("#update_a_num_coolers", "1");

  await page.click("#update_a_returning");
  // await page.click("#update_a_returning > option:nth-child(1)");
  await page.click("#update_a_pmt_made");
  // await page.click("#update_a_pmt_made > option:nth-child(2)");
  await page.click("#update_a_send");

  //testing edit reset
  await page.click("#admin_page_btn");

  await page.click("#update_0");
  await page.click("#update_a_reset");
  browser.close();
}

go();
