const mainElement = document.getElementById("main-content");
const signinButton = document.getElementById("signin");
const signupButton = document.getElementById("signup");
const homeButton = document.getElementById("home");
const logo = document.getElementById("logo");
const nav = document.querySelector("nav");
const footer = document.querySelector("footer");

let userDetails = {};
let accountIcon = null;

function showAccountDetails() {
  if (!mainElement.classList.contains("admin")) {
    mainElement.innerHTML = `
            <div class="box has-background-info">
                <h1 class="title">Account Details</h1>
                <p id="acct_details_name"><strong>Name:</strong></p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <button id="logout" class="button is-danger">Logout</button>
      </div>
        `;
  } else {
    mainElement.innerHTML = `
            <div class="admin box has-background-info">
                <h1 class="title">Account Details</h1>
                <p id="acct_details_name"><strong>Name:</strong> </p>
                <p><strong>Email:</strong> ${userDetails.email}</p>
                <button id="logout" class="button is-danger">Logout</button>
            </div>
        `;
  }
  db.collection("users")
    .where("user_id", "==", firebase.auth().currentUser.uid)
    .get()
    .then((data) => {
      data.docs.forEach((doc) => {
        document.getElementById(
          "acct_details_name"
        ).innerHTML = `<strong>Name:</strong> ${
          doc.data().first_name + " " + doc.data().last_name
        }`;
      });
    });
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
          <p>Two Coolers: $400</p>
          <p>Three Coolers: $475</p>
          <p>Four Coolers: $540</p>
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
          <th>Address</th>
          <th>Apt No.</th>
          <th>Number of Roommates</th>
          <th>Order Amount</th>
          <th>Returning Customer</th>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </table>`;
});

function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      userDetails = {};
      if (accountIcon) {
        accountIcon.remove();
        accountIcon = null;
      }
      // Removing the values from the inquiry form, if the inquiry wasn't submitted and user logged out.
      const inquiry_form = document.getElementById("contactForm");
      const inquiry_form_inputs = inquiry_form.getElementsByTagName("input");
      const contact_us = document.getElementById("contact-us");
      let inquiry_input_num = 0;
      while (inquiry_input_num < inquiry_form_inputs.length) {
        inquiry_form_inputs[inquiry_input_num].value = "";
        inquiry_input_num = inquiry_input_num + 1;
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
      // Putting the contact information back in
      if (contact_us.classList.contains("is-hidden")) {
        contact_us.classList.remove("is-hidden");
        document.getElementById("phone_icon").classList.remove("is-hidden");
        document.getElementById("social_icon").classList.remove("is-hidden");
      }
      loadHomePage();
    });
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
                  <label class="label"> First Name (one per room)</label>
                  <div class="control">
                      <input class="input" type="text" id="signup_name1" required />
                  </div>
                </div>
                <div class="field">
                  <label class="label"> Last Name (one per room)</label>
                  <div class="control">
                      <input class="input" type="text" id="signup_name2" required />
                  </div>
                </div>
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" type="email" id="signup_email" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Password</label>
                    <div class="control">
                        <input class="input" type="password" id="signup_pw" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Confirm Password</label>
                    <div class="control">
                        <input class="input" type="password" id="signup_cpw" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Phone Number</label>
                    <div class="control">
                        <input class="input" type="text" id="signup_phoneno" required />
                    </div>
                </div>
                 <div class="field">
                    <label class="label">Order Semester</label>
                    <div class="control">
                        <input class="input" type="text" id="signup_order_semester" disabled/>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Address</label>
                    <div class="control">
                        <input class="input" type="text" id="signup_address" required />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Apartment Number</label>
                    <div class="control">
                        <input class="input" type="text" id="signup_aptno" />
                    </div>
                </div>
                <div class = "field">
                  <label class = "label"> Number of Roommates </label>
                  <div class = "control">
                    <input class = "input" type = "number" id="signup_num_roommates" required />
                  </div>
                </div>
                <div class = "field" id="signup_names_roommates">
                </div>
                <div class="field">
                    <label class="label">Order Amount</label>
                    <div class="control">
                        <div class="select">
                            <select id="signup_order_amt">
                                <option value="1">One Cooler: $315</option>
                                <option value="2">Two Coolers: $400</option>
                                <option value="3">Three Coolers: $475</option>
                                <option value="4">Four Coolers: $540</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Are you a returning customer? (Answer YES if you already have a machine from last semester)</label>
                    <div class="control">
                        <label class="radio">
                            <input type="radio" name="returning" id="returning_yes" value="yes" /> Yes
                        </label>
                        <label class="radio">
                            <input type="radio" name="returning" id="returning_no" value="no" /> No
                        </label>
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-info">Send</button>
                    </div>
                    <div class="control">
                        <button type="reset" class="button is-light" id="signup_reset">Reset</button>
                    </div>
                </div>
                </form>
                <h2 class="has-text-danger" id="signup_error_message"> </h2>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
    `;
document.body.appendChild(signupModal);

signupButton.addEventListener("click", () => {
  let signup_semester_element = document.getElementById(
    "signup_order_semester"
  );
  db.collection("order_semester_deadlines")
    .where("order_deadline", ">=", new Date(Date.now()))
    .orderBy("order_deadline")
    .limit(1)
    .get()
    .then((data) => {
      signup_semester_element.value = data.docs[0].data().semester;
    });
  signupModal.classList.add("is-active");
});

signupModal.querySelector(".modal-close").addEventListener("click", () => {
  signupModal.classList.remove("is-active");
});
// Getting the field for number of roommates and the div for names of roommates
const signup_num_roommates = document.getElementById("signup_num_roommates");
const signup_names_roommates = document.getElementById(
  "signup_names_roommates"
);
// Adding names of roommates fields to the sign up form dependent on the number of roommates listed
signup_num_roommates.addEventListener("input", () => {
  signup_names_roommates.innerHTML = "";
  let num_roommates = signup_num_roommates.value;
  let num = 1;
  if (num_roommates > 0) {
    signup_names_roommates.innerHTML += `<label class = "label"> Roommates' First and Last Names (optional)</label>`;
    while (num <= num_roommates) {
      signup_names_roommates.innerHTML += `<div class = "field">
          <label class = "label"> Roommate ${num} Name</label>
          <div class = "control">
            <input class = "input signup_roommate_name" type = "text" id="signup_roommate_${num}" />
          </div>
        </div>`;
      num = num + 1;
    }
  }
});
const signup_error_message_elem = document.getElementById(
  "signup_error_message"
);

// When the user resets the sign-up form
document.getElementById("signup_reset").addEventListener("click", () => {
  let signup_semester_element = document.getElementById(
    "signup_order_semester"
  );
  db.collection("order_semester_deadlines")
    .where("order_deadline", ">=", new Date(Date.now()))
    .orderBy("order_deadline")
    .limit(1)
    .get()
    .then((data) => {
      signup_semester_element.value = data.docs[0].data().semester;
    });
});
// When the user signs up
signupModal
  .querySelector("#signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let signup_pw = document.getElementById("signup_pw").value;
    let signup_confirm_pw = document.getElementById("signup_cpw").value;
    if (signup_pw != signup_confirm_pw) {
      signup_error_message_elem.innerHTML = "Passwords do not match.";
    } else if (signup_num_roommates.value < 0) {
      signup_error_message_elem.innerHTML = "Invalid number of roommates.";
    } else {
      let user_info = {
        first_name: document.getElementById("signup_name1").value,
        last_name: document.getElementById("signup_name2").value,
        email: document.getElementById("signup_email").value,
        phone_no: document.getElementById("signup_phoneno").value,
        is_admin: false,
      };
      let returning_customer_yes = document.getElementById("returning_yes");
      let returning_customer = true;
      if (returning_customer_yes.checked == false) {
        returning_customer = false;
      }
      let num_roommates = signup_num_roommates.value;
      let roommates_names_elements = document.getElementsByClassName(
        "signup_roommate_name"
      );
      let roommates_names = [];
      let num = 0;
      while (num < roommates_names_elements.length) {
        roommates_names.push(roommates_names_elements[num].value);
        num = num + 1;
      }
      if (num_roommates == 0) {
        roommates_names = null;
      }
      let customer_info = {
        address: document.getElementById("signup_address").value,
        apt_no: document.getElementById("signup_aptno").value,
        number_of_coolers: Number(
          document.getElementById("signup_order_amt").value
        ),
        returning_customer: returning_customer,
        names_of_roommates: roommates_names,
        number_of_roommates: Number(num_roommates),
        payment_made: false,
        order_semester: document.getElementById("signup_order_semester").value,
      };
      firebase
        .auth()
        .createUserWithEmailAndPassword(
          user_info.email,
          document.getElementById("signup_pw").value
        )
        .then((userCredential) => {
          let user = userCredential.user;
          user_info.user_id = user.uid;
          customer_info.user_id = user.uid;
          // firebase.auth().currentUser.sendEmailVerification().then();
          db.collection("users")
            .doc(user.uid)
            .set(user_info)
            .then(() => {
              db.collection("customer_info")
                .add(customer_info)
                .then(() => {
                  semester_id = "";
                  userDetails.name =
                    document.getElementById("signup_name1").value +
                    " " +
                    document.getElementById("signup_name2").value;
                  userDetails.email =
                    document.getElementById("signup_email").value;
                  signinButton.style.display = "none"; // Hide Sign In button
                  signupButton.style.display = "none"; // Hide Sign Up button
                  addAccountIcon();
                  signupModal.classList.remove("is-active");
                  // Getting the signup form elements so that the values can be removed
                  let signup_form = document.getElementById("signupForm");
                  let input_num = 0;
                  let signup_form_inputs =
                    signup_form.getElementsByTagName("input");
                  // Removing values after signup
                  while (input_num < signup_form_inputs.length) {
                    if (signup_form_inputs[input_num].type == "radio") {
                      signup_form_inputs[input_num].checked = false;
                    } else {
                      signup_form_inputs[input_num].value = "";
                    }
                    input_num = input_num + 1;
                  }
                  let signup_form_selects =
                    signup_form.getElementsByClassName("select");
                  let select_num = 0;
                  // Removing values after signup
                  while (select_num < signup_form_selects.length) {
                    signup_form_selects[select_num].value = "";
                    select_num = select_num + 1;
                  }
                  showAccountDetails();
                })
                .catch((error) => {
                  user.delete().then();
                });
            })
            .catch((error) => {
              user.delete().then();
            });
        })
        .catch((error) => {
          if (error.code == "auth/email-already-in-use") {
            signup_error_message_elem.innerHTML =
              "This email is already in-use. Please use another email.";
          } else if (error.code == "auth/weak-password") {
            signup_error_message_elem.innerHTML =
              "Please make a password that has a minimum of 6 characters.";
          } else {
            signup_error_message_elem.innerHTML =
              "Sorry, there is an issue with making your account. Please try again later.";
          }
        });
    }
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
                            <input class="input" type="email" id="signin_email" required>
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">Password</label>
                        <div class="control">
                            <input class="input" type="password" id="signin_pw" required>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button type="submit" class="button is-info">Sign In</button>
                        </div>
                    </div>
                </form>
                <h2 class="has-text-danger" id="signin_error_message"> </h2>
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
    signin_email = document.getElementById("signin_email").value;
    signin_pw = document.getElementById("signin_pw").value;
    firebase
      .auth()
      .signInWithEmailAndPassword(signin_email, signin_pw)
      .then((credential) => {
        let user = credential.user;
        userDetails.email = signin_email;
        signinButton.style.display = "none"; // Hide Sign In button
        signupButton.style.display = "none"; // Hide Sign Up button
        account_icon.classList.remove("is-hidden");
        // addAccountIcon();
        signinModal.classList.remove("is-active");
        document.getElementById("signin_email").value = "";
        document.getElementById("signin_pw").value = "";
        db.collection("users")
          .where("user_id", "==", user.uid)
          .get()
          .then((data) => {
            if (data.docs[0].data().is_admin == true) {
              admin_page_btn.classList.remove("is-hidden");
              document.getElementById("contact-us").classList.add("is-hidden");
              document.getElementById("phone_icon").classList.add("is-hidden");
              document.getElementById("social_icon").classList.add("is-hidden");
            }
          });
        showAccountDetails();
      })
      .catch((error) => {
        if (error.code == "auth/invalid-credential") {
          document.getElementById("signin_error_message").innerHTML =
            "Invalid email and/or password";
        } else {
          document.getElementById("signin_error_message").innerHTML =
            "Sorry, there was a problem. Please try again later.";
        }
      });
  });

homeButton.addEventListener("click", loadHomePage);
logo.addEventListener("click", loadHomePage);

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
                    <label class="label">First Name</label>
                    <div class="control">
                        <input class="input" type="text" id="inquiry_name1" required disabled />
                    </div>
                </div>
                <div class="field">
                    <label class="label">Last Name</label>
                    <div class="control">
                        <input class="input" type="text" id="inquiry_name2" required disabled/>
                    </div>
                </div>
                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" type="email" id="inquiry_email" required disabled/>
                    </div>
                </div>
                <div class = "field">
                    <label class = "label"> Your Question </label>
                    <div class = "control">
                    <input class = "input" type = "textarea" id="inquiry_details" required />
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="control">
                        <button type="submit" class="button is-info" id="inquiry_send">Send</button>
                    </div>
                    <div class="control">
                        <button type="reset" class="button is-light" id="inquiry_reset">Reset</button>
                    </div>
                </div>
            </form>
            <h2 class="has-text-info" id="inquiry_message"> </h2>
        </div>
    </div>
    <button class="modal-close is-large" aria-label="close"></button>
`;
document.body.appendChild(contactUsModal);
contactUs = document.getElementById("contact-us");
contactUs.addEventListener("click", () => {
  if (firebase.auth().currentUser) {
    db.collection("users")
      .where("user_id", "==", firebase.auth().currentUser.uid)
      .get()
      .then((data) => {
        user_data = data.docs[0].data();
        document
          .getElementById("inquiry_name1")
          .setAttribute("input", "disabled");
        document
          .getElementById("inquiry_name2")
          .setAttribute("input", "disabled");
        document
          .getElementById("inquiry_email")
          .setAttribute("input", "disabled");
        document.getElementById("inquiry_name1").value = user_data.first_name;
        document.getElementById("inquiry_name2").value = user_data.last_name;
        document.getElementById("inquiry_email").value = user_data.email;
      });
  } else {
    document.getElementById("inquiry_name1").removeAttribute("disabled");
    document.getElementById("inquiry_name2").removeAttribute("disabled");
    document.getElementById("inquiry_email").removeAttribute("disabled");
  }
  contactUsModal.classList.add("is-active");
});

contactUsModal.querySelector(".modal-close").addEventListener("click", () => {
  // Removing the values from the inquiry form, if the inquiry modal is closed by the user.
  const inquiry_form = document.getElementById("contactForm");
  const inquiry_form_inputs = inquiry_form.getElementsByTagName("input");
  let inquiry_input_num = 0;
  while (inquiry_input_num < inquiry_form_inputs.length) {
    inquiry_form_inputs[inquiry_input_num].value = "";
    inquiry_input_num = inquiry_input_num + 1;
  }
  contactUsModal.classList.remove("is-active");
});

// Submitting the inquiry
const inquiry_send_btn = document.getElementById("inquiry_send");
inquiry_send_btn.addEventListener("click", () => {
  event.preventDefault();
  let inquiry_info = {
    first_name: document.getElementById("inquiry_name1").value,
    last_name: document.getElementById("inquiry_name2").value,
    email: document.getElementById("inquiry_email").value,
    inquiry_details: document.getElementById("inquiry_details").value,
    timestamp: new Date(Date.now()),
  };
  db.collection("inquiries")
    .add(inquiry_info)
    .then(() => {
      inquiry_message_elem = document.getElementById("inquiry_message");
      inquiry_message_elem.innerHTML = "Your inquiry has been submitted.";
      setTimeout(() => {
        contactUsModal.classList.remove("is-active");
      }, 3000);
      inquiry_message_elem.innerHTML = "";
    })
    .catch((error) => {
      inquiry_message_elem = document.getElementById("inquiry_message");
      inquiry_message_elem.classList.remove("has-text-info");
      inquiry_message_elem.classList.add("has-text-danger");
      document.getElementById("inquiry_message").innerHTML =
        "Sorry, your inquiry was not processed. Please try again later.";
    });
});

const phoneModal = document.getElementById("phonemodal");
const phone_icon = document.getElementById("phone_icon");
const social_icon = document.getElementById("social_icon");

phone_icon.addEventListener("click", () => {
  phoneModal.classList.add("is-active");
});

const phoneModalClose = document.getElementById("phonemodal-close");
phoneModalClose.addEventListener("click", () => {
  phoneModal.classList.remove("is-active");
});
