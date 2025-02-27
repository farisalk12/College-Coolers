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
        mainElement.innerHTML = `
            <div class="form">
                <h1>Account Details</h1>
                <p><strong>Name:</strong> ${userDetails.name}</p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <button id="logout">Logout</button>
            </div>
        `;

        document.getElementById("logout").addEventListener("click", logout);
    }

    function logout() {
        userDetails = {};
        if (accountIcon) {
            accountIcon.remove();
            accountIcon = null;
        }
        loadHomePage();
    }

    function loadHomePage() {
        mainElement.innerHTML = `
            <section class="hero">
                <h1>Welcome to College Coolers</h1>
                <p>We deliver water coolers every semester across apartments in Madison, WI.</p>
            </section>
            <section class="info">
                <div class="semester_info">Upcoming Semesters</div>
                <div class="semester_info">Fall 2025</div>
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

    signupButton.addEventListener("click", () => {
        mainElement.innerHTML = `
            <div class="form">
                <h1>Sign Up</h1>
                <form id="signupForm">
                    <p>Name: <input type="text" id="signupName" required></p>
                    <p>Email: <input type="email" id="signupEmail" required></p>
                    <p>Password: <input type="password" required></p>
                    <p>Confirm Password: <input type="password" required></p>
                    <input type="submit" value="Sign Up">
                </form>
            </div>
        `;

        document.getElementById("signupForm").addEventListener("submit", function (event) {
            event.preventDefault();
            userDetails.name = document.getElementById("signupName").value;
            userDetails.email = document.getElementById("signupEmail").value;
            addAccountIcon();
            showAccountDetails();
        });
    });

    signinButton.addEventListener("click", () => {
        mainElement.innerHTML = `
            <div class="form">
                <h3 style="text-align: center">Sign in to your College Coolers Account.</h3>
                <form id="signinForm">
                    <p>Email: <input type="email" id="signinEmail" required></p>
                    <p>Password: <input type="password" required></p>
                    <input type="submit" value="Sign In">
                </form>
            </div>
        `;

        document.getElementById("signinForm").addEventListener("submit", function (event) {
            event.preventDefault();
            userDetails.email = document.getElementById("signinEmail").value;
            userDetails.name = "User";
            addAccountIcon();
            showAccountDetails();
        });
    });

    homeButton.addEventListener("click", loadHomePage);

    // Add Contact Us in the footer
    const contactUs = document.createElement("p");
    contactUs.innerHTML = `<a href="#contact" id="contact-us" class="contact-link">Contact Us</a>`;
    contactUs.addEventListener("click", () => {
        mainElement.innerHTML = `
   <div class="form">      
   <h1>How can we assist you?</h1>
   <form class="form">
       <p>Name(one per room) <input type="text" required /></p>
       <p>Email <input type = "email" required /> </p>
       <p>Password <input type = "password" required /> </p>
       <p>Confirm Password <input type = "password" required /> </p>
       <p>Phone Number <input type="text" required /></p>
       <p>Building Name <input type="text" required /></p>
       <p>room number <input type="text" required /></p>
       <p>
        Names of Roommates (put N/A if applicable)
       <input type="text" required />
       </p>
       <p>
       Order amount?
       <select>
           <option>One Cooler: $315</option>
           <option>Two Coolers: $400</option>
           <option>Three Coolers: $475</option>
           <option>Four Coolers: $540</option>
       </select>
       </p>
       Are you a returning customer? (Answer YES if you already have a
       machine from last semester)
       <input type="radio" value="returning" />Yes
       <input type="radio" value="returning" />No
       <p></p>
       <input type="submit" id="signup_submit" value="Send" />
       <input type="reset" value="Reset" />
   </form>
   </div>`;
});

    // Ensure only one Contact Us link exists
    footer.innerHTML = ""; // Clear any existing duplicate links
    footer.appendChild(contactUs);
});
