// Based on professor's code
const puppeteer = require("puppeteer");

async function go() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 50,
  });
  const page = await browser.newPage();
  await page.goto("https://college-coolers.web.app/home.html");

  // click on the sign-in button

  await page.click("#signin");

  //   provide email and pasword to sign in

  await page.type("#signin_email", "falconoakeagle2047+test@gmail.com");
  await page.type("#signin_pw", "123@abc");

  // click on the submit button
  await page.click("#signinForm > div:nth-child(3) > div > button");

  // This is to open at Venmo modal
  await new Promise((r) => setTimeout(r, 1000));
  await page.click("#pay_now_btn");

  // This is to close the Venmo modal
  await new Promise((r) => setTimeout(r, 1000));
  await page.click("#pay_now_modal > button");

  // Update info
  await new Promise((r) => setTimeout(r, 1000));
  await page.click("#update_info_btn");
  // Filling out the update form
  await page.type("#signup_name1", "AA");
  await page.type("#signup_name2", "BC");
  await page.type("#signup_phoneno", "2");
  await page.click("#signup_order_semester");
  // await page.click("#signup_order_semester > option:nth-child(2)");
  await page.type("#signup_address", " Madison, WI, 53703");
  await page.type("#signup_num_roommates", "2");
  await page.type("#signup_roommate_1", "John Doe");
  await page.type("#signup_roommate_2", "Jane Doe");
  await page.click("#signup_order_amt");
  await page.type("#signup_order_amt");
  await page.click("#returning_yes");
  // Submitting the form
  await page.click(
    "#signupForm > div.field.is-grouped > div:nth-child(1) > button"
  );
  await page.click("#account_icon");

  //   await new Promise((r) => setTimeout(r, 1000));

  //   await page.type("#search_bar", "my test car");

  //   await page.click("#search_button");

  //   close the browser

  //   browser.close();
}
go();
