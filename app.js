document.addEventListener("DOMContentLoaded", function () {
  const mainElement = document.getElementById("main-content");
  const signinButton = document.getElementById("signin");
  const signupButton = document.getElementById("signup");
  const homeButton = document.getElementById("home");
  const nav = document.querySelector("nav");
  const footer = document.querySelector("footer");

  let userDetails = {};
  let accountIcon = null;

  function showAccountDetails() {
    if (!mainElement.classList.contains("admin")) {
      mainElement.innerHTML = `
            <div class="box has-background-info">
                <h1 class="title">Account Details</h1>
                <p><strong>Name:</strong> ${userDetails.name}</p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <button id="logout" class="button is-danger">Logout</button>
      </div>
        `;
    } else {
      mainElement.innerHTML = `
            <div class="admin box has-background-info">
                <h1 class="title">Account Details</h1>
                <p><strong>Name:</strong> ${userDetails.name}</p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <button id="logout" class="button is-danger">Logout</button>
            </div>
        `;
    }
    document.getElementById("logout").addEventListener("click", logout);
  }

  function loadHomePage() {
    mainElement.innerHTML = `
            <section class="hero is-medium is-info">
        <div class="hero-body">
          <div class="container has-text-centered">
            <h1 class="title">Welcome to College Coolers</h1>
            <p class="subtitle">
              We deliver water coolers every semester across apartments in
              Madison, WI.
            </p>
          </div>
        </div>
      </section>
      <section class="info">
        <div class="semester_info box">
          For the last 18 years we have provided the highest quality water to
          students across UW Madison Campus. We deliver water coolers right to
          your door every single week, ensuring you stray hydrated all semester
          long. All you have to do is create an account with your name and phone
          number, where you are currently living, and the number of coolers you
          will need each week. For new customers, we will provide you with the
          dispensing machine, free of charge!
        </div>
        <div class="semester_info box">
          Spring 2025 Rates:
          <p>One Cooler: $315</p>
          <p>Two Cooler: $400</p>
          <p>Three Cooler: $475</p>
          <p>Four Cooler: $540</p>
        </div>
      </section>
        `;
  }

  function addAccountIcon() {
    if (!accountIcon) {
      accountIcon = document.createElement("img");
      accountIcon.src = "favicon.png"; // Use the favicon as the account icon
      accountIcon.alt = "Account Icon";
      accountIcon.classList.add("account-icon"); // Assign a CSS class
      accountIcon.addEventListener("click", showAccountDetails);
      nav.appendChild(accountIcon);
    }
  }

  const account_icon = document.getElementById("account-icon");
  account_icon.addEventListener("click", showAccountDetails);
  const admin_page_btn = document.getElementById("admin_page_btn");
  admin_page_btn.addEventListener("click", () => {
    mainElement.innerHTML = `<input class="input" placeholder="Search" />
      <table
        class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth"
      >
        <tr>
          <th>Name</th>
          <th>Building Name</th>
          <th>Room No.</th>
          <th>Number of Roommates</th>
          <th>Order Amount</th>
          <th>Returning Customer</th>
        </tr>
        <tr>
          <td>John Doe</td>
          <td>Any Place</td>
          <td>3500</td>
          <td>2</td>
          <td>1</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>John Doe</td>
          <td>Any Place</td>
          <td>3500</td>
          <td>2</td>
          <td>1</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>John Doe</td>
          <td>Any Place</td>
          <td>3500</td>
          <td>2</td>
          <td>1</td>
          <td>Yes</td>
        </tr>
      </table>`;
  });

  function logout() {
    userDetails = {};
    if (accountIcon) {
      accountIcon.remove();
      accountIcon = null;
    }
    signinButton.style.display = "inline-block";
    signupButton.style.display = "inline-block";
    if (signupButton.classList.contains("is-hidden")) {
      signupButton.classList.remove("is-hidden");
    }
    if (signinButton.classList.contains("is-hidden")) {
      signinButton.classList.remove("is-hidden");
    }
    if (mainElement.classList.contains("admin")) {
      mainElement.classList.remove("admin");
    }
    account_icon.classList.add("is-hidden");
    if (mainElement.classList.contains("admin")) {
      mainElement.classList.remove("admin");
    }
    if (!admin_page_btn.classList.contains("is-hidden")) {
      admin_page_btn.classList.add("is-hidden");
    }
    loadHomePage();
  }

  // Sign Up Modal
  const signupModal = document.createElement("div");
  signupModal.classList.add("modal");
  signupModal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <h1 class="title">Sign Up</h1>
                <form id="signupForm">
                    <div class="field">
                    <label class="label">Name (one per room)</label>
                    <div class="control">
                        <input class="input" type="text" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" type="email" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input" type="password" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Confirm Password</label>
                    <div class="control">
                        <input class="input" type="password" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Phone Number</label>
                    <div class="control">
                        <input class="input" type="text" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Address</label>
                    <div class="control">
                        <input class="input" type="text" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Apartment Number</label>
                    <div class="control">
                        <input class="input" type="text" required />
                    </div>
                </div>
                <div class = "field">
                  <label class = "label"> Number of Roommates </label>
                  <div class = "control">
                    <input class = "input" type = "number" required />
                  </div>
                </div>
                <div class="field">
                    <label class="label">Names of Roommates (put N/A if applicable)</label>
                    <div class="control">
                        <input class="input" type="text" />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Order Amount</label>
                    <div class="control">
                        <div class="select">
                            <select>
                                <option>One Cooler: $315</option>
                                <option>Two Coolers: $400</option>
                                <option>Three Coolers: $475</option>
                                <option>Four Coolers: $540</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Are you a returning customer? (Answer YES if you already have a machine from last semester)</label>
                    <div class="control">
                        <label class="radio">
                            <input type="radio" name="returning" value="yes" /> Yes
                        </label>
                        <label class="radio">
                            <input type="radio" name="returning" value="no" /> No
                        </label>
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-info">Send</button>
                    </div>
                    <div class="control">
                        <button type="reset" class="button is-light">Reset</button>
                    </div>
                </div>
                </form>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
    `;
  document.body.appendChild(signupModal);

  signupButton.addEventListener("click", () => {
    signupModal.classList.add("is-active");
  });

  signupModal.querySelector(".modal-close").addEventListener("click", () => {
    signupModal.classList.remove("is-active");
  });

  signupModal
    .querySelector("#signupForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      userDetails.name = document.getElementById("signupName").value;
      userDetails.email = document.getElementById("signupEmail").value;
      signinButton.style.display = "none"; // Hide Sign In button
      signupButton.style.display = "none"; // Hide Sign Up button
      addAccountIcon();
      signupModal.classList.remove("is-active");
      showAccountDetails();
    });

  // Sign In Modal
  const signinModal = document.createElement("div");
  signinModal.classList.add("modal");
  signinModal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <h3 class="title is-4" style="text-align: center">Sign in to your College Coolers Account.</h3>
                <form id="signinForm">
                    <div class="field">
                        <label class="label">Email</label>
                        <div class="control">
                            <input class="input" type="email" id="signinEmail" required>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control">
                            <input class="input" type="password" required>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button type="submit" class="button is-info">Sign In</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
    `;
  document.body.appendChild(signinModal);

  signinButton.addEventListener("click", () => {
    signinModal.classList.add("is-active");
  });

  signinModal.querySelector(".modal-close").addEventListener("click", () => {
    signinModal.classList.remove("is-active");
  });

  signinModal
    .querySelector("#signinForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      userDetails.email = document.getElementById("signinEmail").value;
      userDetails.name = "User";
      signinButton.style.display = "none"; // Hide Sign In button
      signupButton.style.display = "none"; // Hide Sign Up button
      account_icon.classList.remove("is-hidden");
      // addAccountIcon();
      signinModal.classList.remove("is-active");
      showAccountDetails();
    });

  homeButton.addEventListener("click", loadHomePage);

  // Contact Us Modal
  const contactUsModal = document.createElement("div");
  contactUsModal.classList.add("modal");
  contactUsModal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
        <div class="box">
            <h1 class="title is-3">How can we assist you?</h1>
            <form id="contactForm">
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input class="input" type="text" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" type="email" required />
                    </div>
                </div>
                <div class = "field">
                    <label class = "label"> Your Question </label>
                    <div class = "control">
                    <input class = "input" type = "textarea" required />
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-info">Send</button>
                    </div>
                    <div class="control">
                        <button type="reset" class="button is-light">Reset</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
`;
  document.body.appendChild(contactUsModal);
  contactUs = document.getElementById("contact-us");
  contactUs.addEventListener("click", () => {
    contactUsModal.classList.add("is-active");
  });

  contactUsModal.querySelector(".modal-close").addEventListener("click", () => {
    contactUsModal.classList.remove("is-active");
  });

  // Footer with icons
  const phoneIcon = document.createElement("img");
  phoneIcon.src = "telephone.png";
  phoneIcon.alt = "Phone Icon";
  phoneIcon.classList.add("footer-icon");

  const phoneModal = document.getElementById("phonemodal");

  phoneIcon.addEventListener("click", () => {
    phoneModal.classList.add("is-active");
  });

  const phoneModalClose = document.getElementById("phonemodal-close");
  phoneModalClose.addEventListener("click", () => {
    phoneModal.classList.remove("is-active");
  });

  const instagramIcon = document.createElement("img");
  instagramIcon.src = "social.png";
  instagramIcon.alt = "Instagram Icon";
  instagramIcon.classList.add("footer-icon");
  instagramIcon.addEventListener("click", function () {
    window.location.href = "https://www.instagram.com/collegecoolersuw/";
  });

  footer.appendChild(phoneIcon);
  footer.appendChild(instagramIcon);
});
