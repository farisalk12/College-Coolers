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
  let isAdmin = false;

  // Fetch user info first to determine admin status
  db.collection("users")
    .where("user_id", "==", firebase.auth().currentUser.uid)
    .get()
    .then((data) => {
      const userData = data.docs[0].data();
      isAdmin = userData.is_admin === true;

      // BASE HTML
      let accountHTML = `
        <div class="box has-background-info">
          <h1 class="title">Account Details</h1>
          <p id="acct_details_name"><strong>Name:</strong> ${userData.first_name} ${userData.last_name}</p>
          <p><strong>Email:</strong> ${userDetails.email}</p>
      `;

      if (!isAdmin) {
        accountHTML += `
          <p id="acct_details_phone"><strong>Phone Number:</strong> ${userData.phone_no}</p>
          <p id="acct_details_address"><strong>Address:</strong></p>
          <p id="acct_details_apt"><strong>Apartment Number:</strong></p>
          <p id="acct_details_coolers"><strong>Number of Coolers:</strong></p>
          <p id="acct_details_returning"><strong>Returning Customer:</strong></p>
          <p id="acct_details_roommates"><strong>Roommates:</strong></p>
          <p id="acct_details_order_semester"><strong>Order Semester:</strong></p>
          <div class="buttons mt-4">
            <button id="pay_now_btn" class="button is-white">Pay Now</button>
            <button id="update_info_btn" class="button is-white">Update Order Info</button>
            <button id="logout" class="button is-danger">Logout</button>
          </div>
        `;
      } else {
        accountHTML += `<button id="logout" class="button is-danger mt-3">Logout</button>`;
      }

      accountHTML += `</div>`;
      mainElement.innerHTML = accountHTML;

      // For regular users only → fetch customer info and enable buttons
      if (!isAdmin) {
        db.collection("customer_info")
          .where("user_id", "==", firebase.auth().currentUser.uid)
          .get()
          .then((data) => {
            const customerData = data.docs[0].data();
            document.getElementById("acct_details_address").innerHTML = `<strong>Address:</strong> ${customerData.address}`;
            document.getElementById("acct_details_apt").innerHTML = `<strong>Apartment Number:</strong> ${customerData.apt_no || "N/A"}`;
            document.getElementById("acct_details_coolers").innerHTML = `<strong>Number of Coolers:</strong> ${customerData.number_of_coolers || 0}`;
            document.getElementById("acct_details_returning").innerHTML = `<strong>Returning Customer:</strong> ${customerData.returning_customer ? "Yes" : "No"}`;
            document.getElementById("acct_details_roommates").innerHTML = `<strong>Roommates:</strong> ${customerData.names_of_roommates?.join(", ") || "None"}`;
            document.getElementById("acct_details_order_semester").innerHTML = `<strong>Order Semester:</strong> ${customerData.order_semester || "N/A"}`;
            document.getElementById("acct_details_order_semester").insertAdjacentHTML(
              "afterend",
              `<p><strong>Payment Status:</strong> ${customerData.payment_made ? "Payment received" : "Payment not received yet"}</p>`
            );
          });

        // Pay Now Button
        document.getElementById("pay_now_btn").addEventListener("click", () => {
          db.collection("customer_info")
            .where("user_id", "==", firebase.auth().currentUser.uid)
            .get()
            .then((data) => {
              const info = data.docs[0].data();
              const coolerRates = { 1: 315, 2: 400, 3: 475, 4: 540 };
              const amount = coolerRates[info.number_of_coolers] || 0;
              document.getElementById("amount_due").innerText = `Amount Due: $${amount}`;
              document.getElementById("pay_now_modal").classList.add("is-active");
            });
        });

        // Update Info Button
        document.getElementById("update_info_btn").addEventListener("click", () => {
          signupModal.classList.add("is-active");
          signupModal.querySelector("h1.title").innerText = "Update Your Info";
          document.getElementById("signup_email").disabled = true;
          document.getElementById("signup_pw").disabled = true;
          document.getElementById("signup_cpw").disabled = true;

          db.collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((doc) => {
              const data = doc.data();
              document.getElementById("signup_name1").value = data.first_name;
              document.getElementById("signup_name2").value = data.last_name;
              document.getElementById("signup_phoneno").value = data.phone_no;
              document.getElementById("signup_email").value = data.email;
            });

          db.collection("customer_info")
            .where("user_id", "==", firebase.auth().currentUser.uid)
            .get()
            .then((data) => {
              const doc = data.docs[0];
              const customerData = doc.data();

              document.getElementById("signup_address").value = customerData.address;
              document.getElementById("signup_aptno").value = customerData.apt_no;
              document.getElementById("signup_order_amt").value = customerData.number_of_coolers;
              document.getElementById("signup_order_semester").value = customerData.order_semester;
              document.getElementById("signup_num_roommates").value = customerData.number_of_roommates;

              signup_num_roommates.dispatchEvent(new Event("input"));

              if (customerData.names_of_roommates?.length > 0) {
                setTimeout(() => {
                  const roommateInputs = document.getElementsByClassName("signup_roommate_name");
                  customerData.names_of_roommates.forEach((name, index) => {
                    roommateInputs[index].value = name;
                  });
                }, 100);
              }

              if (customerData.returning_customer) {
                document.getElementById("returning_yes").checked = true;
              } else {
                document.getElementById("returning_no").checked = true;
              }

              const form = document.getElementById("signupForm");
              form.onsubmit = (e) => {
                e.preventDefault();

                const updatedUser = {
                  first_name: document.getElementById("signup_name1").value,
                  last_name: document.getElementById("signup_name2").value,
                  phone_no: document.getElementById("signup_phoneno").value,
                };

                const updatedCustomer = {
                  address: document.getElementById("signup_address").value,
                  apt_no: document.getElementById("signup_aptno").value,
                  number_of_coolers: Number(document.getElementById("signup_order_amt").value),
                  order_semester: document.getElementById("signup_order_semester").value,
                  number_of_roommates: Number(document.getElementById("signup_num_roommates").value),
                  names_of_roommates: Array.from(document.getElementsByClassName("signup_roommate_name")).map(el => el.value),
                  returning_customer: document.getElementById("returning_yes").checked,
                };

                db.collection("users")
                  .doc(firebase.auth().currentUser.uid)
                  .update(updatedUser)
                  .then(() => {
                    db.collection("customer_info")
                      .doc(doc.id)
                      .update(updatedCustomer)
                      .then(() => {
                        signupModal.classList.remove("is-active");
                        loadHomePage();
                      });
                  });
              };
            });
        });
      }

      // Logout works for all
      document.getElementById("logout").addEventListener("click", logout);
    });
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
        class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" id="admin_info"
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
  let pairings = [];
  db.collection("customer_info")
    .get()
    .then((data) => {
      let admin_table = document.getElementById("admin_info");
      admin_table.innerHTML = `<tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Address</th>
          <th>Apt No.</th>
          <th>Number of Roommates</th>
          <th>Order Amount</th>
          <th>Returning Customer</th>
          <th>Payment Made </th>
          <th>Edit Info </th>
        </tr>`;
      let i = 0;
      data.docs.forEach((doc) => {
        pairings.push(doc.id);
        info_data = doc.data();
        admin_table.innerHTML += `<tr id="row_${i}">
          <td id="first_name_${i}"></td>
            <td id="last_name_${i}"></td>
            <td id="address_${i}"> ${info_data.address}</td>
            <td id="apt_no_${i}">${info_data.apt_no}</td>
            <td id="num_roommates_${i}">${info_data.number_of_roommates}</td>
            <td id="order_amt_${i}">${info_data.number_of_coolers}</td>
            <td id="returning_${i}">${info_data.returning_customer}</td>
            <td id="payment_made_${i}">${info_data.payment_made}</td>
            <td>
            <button class="button has-background-success update_info" id="update_${i}"> Edit </button>
            </td>
            </tr>`;
        let first_name_id = `first_name_${i}`;
        let last_name_id = `last_name_${i}`;
        db.collection("users")
          .where("user_id", "==", info_data.user_id)
          .get()
          .then((user_data) => {
            document.getElementById(first_name_id).innerHTML =
              user_data.docs[0].data().first_name;
            document.getElementById(last_name_id).innerHTML =
              user_data.docs[0].data().last_name;
          });
        i = i + 1;
      });
      let info_update_buttons = document.getElementsByClassName("update_info");
      let cust_order_semester = "";
      let num = 0;
      while (num < info_update_buttons.length) {
        let index = Number(info_update_buttons[num].id.split("_")[1]);
        document.getElementById("num").innerHTML = index;
        info_update_buttons[index].addEventListener("click", () => {
          document
            .getElementById("update_cust_info_ad_modal")
            .classList.add("is-active");
          document
            .getElementById("update_cust_info_ad_close")
            .addEventListener("click", () => {
              document
                .getElementById("update_cust_info_ad_modal")
                .classList.remove("is-active");
            });
          db.collection("customer_info")
            .get()
            .then((data) => {
              data.docs.forEach((doc) => {
                if (doc.id == pairings[index]) {
                  document.getElementById(
                    "update_a_order_semester"
                  ).innerHTML = `<option> ${
                    doc.data().order_semester
                  } </option>`;
                  cust_order_semester = doc.data().order_semester;
                  db.collection("users")
                    .where("user_id", "==", doc.data().user_id)
                    .get()
                    .then((user_data) => {
                      document.getElementById("update_a_email").value =
                        user_data.docs[0].data().email;
                    });
                }
              });
              let first_name_id = `first_name_${index}`;
              let last_name_id = `last_name_${index}`;
              let address_id = `address_${index}`;
              let apt_no_id = `apt_no_${index}`;
              let num_roommates_id = `num_roommates_${index}`;
              let returning_id = `returning_${index}`;
              let pmt_made_id = `payment_made_${index}`;
              document.getElementById("update_a_name1").value =
                document.getElementById(first_name_id).innerHTML;
              document.getElementById("update_a_name2").value =
                document.getElementById(last_name_id).innerHTML;

              db.collection("order_semester_deadlines")
                .orderBy("order_deadline")
                .limit(4)
                .get()
                .then((os_data) => {
                  os_docs = os_data.docs;
                  os_docs.forEach((os_doc) => {
                    let os_doc_order_semester = os_doc.data().semester;
                    if (cust_order_semester != os_doc_order_semester) {
                      document.getElementById(
                        "update_a_order_semester"
                      ).innerHTML += `<option> ${os_doc_order_semester} </option>`;
                    }
                  });
                });
              document.getElementById("update_a_address").value =
                document.getElementById(address_id).innerHTML;
              document.getElementById("update_a_apt_no").value =
                document.getElementById(apt_no_id).innerHTML;
              document.getElementById("update_a_num_roommates").value =
                document.getElementById(num_roommates_id).innerHTML;
              if (Boolean(document.getElementById(returning_id))) {
                document.getElementById(
                  "update_a_returning"
                ).innerHTML = `<option>True</option>
                <option> False </option>`;
              } else {
                document.getElementById(
                  "update_a_returning"
                ).innerHTML = `<option>False</option>
                <option> True </option>`;
              }
              if (Boolean(document.getElementById(pmt_made_id))) {
                document.getElementById(
                  "update_a_pmt_made"
                ).innerHTML = `<option>True</option>
                <option> False </option>`;
              } else {
                document.getElementById(
                  "update_a_pmt_made"
                ).innerHTML = `<option>False</option>
                <option> True </option>`;
              }
            });
        });
        num = num + 1;
      }
    });
  document.getElementById("update_a_send").addEventListener("click", () => {
    event.preventDefault();
    let cust_doc_id =
      pairings[Number(document.getElementById("num").innerHTML)];
    let returning_customer_value = false;
    if (document.getElementById("update_a_returning").value == "True") {
      returning_customer_value = true;
    }
    let payment_made_value = false;
    if (document.getElementById("update_a_pmt_made").value == "True") {
      payment_made_value = true;
    }
    db.collection("customer_info")
      .doc(cust_doc_id)
      .update({
        address: document.getElementById("update_a_address").value,
        apt_no: document.getElementById("update_a_apt_no").value,
        number_of_roommates: document.getElementById("update_a_num_roommates")
          .value,
        returning_customer: returning_customer_value,
        payment_made: payment_made_value,
        order_semester: document.getElementById("update_a_order_semester")
          .value,
        order_semester_id:
          document
            .getElementById("update_a_order_semester")
            .value.split(" ")[0]
            .toLowerCase() +
          "_" +
          document
            .getElementById("update_a_order_semester")
            .value.split(" ")[1],
      })
      .then();
  });
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

      if (contact_us.classList.contains("is-hidden")) {
        contact_us.classList.remove("is-hidden");
        document.getElementById("phone_icon").classList.remove("is-hidden");
        document.getElementById("social_icon").classList.remove("is-hidden");
      }
      loadHomePage();
      location.reload();
    });
}

// Sign Up Modal
const signupModal = document.createElement("div");
signupModal.classList.add("modal");
signupModal.innerHTML = `
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <h1 class="title">Order Sign Up</h1>
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
                      <div class = "select">
                        <select id = "signup_order_semester">
                        </select>
                      </div>
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
let signup_semester_element = document.getElementById("signup_order_semester");
db.collection("order_semester_deadlines")
  .where("order_deadline", ">=", new Date(Date.now()))
  .orderBy("order_deadline")
  .limit(2)
  .get()
  .then((data) => {
    data.docs.forEach((doc) => {
      signup_semester_element.innerHTML += `<option> ${
        doc.data().semester
      } </option>`;
    });
  });
let semester_id = "";
signupButton.addEventListener("click", () => {
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
  signup_names_roommates.innerHTML = "";
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
        order_semester_id: document
          .getElementById("signup_order_semester")
          .value.toLowerCase()
          .split(" ")
          .join("_"),
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
                  signup_names_roommates.innerHTML = "";
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
        document.getElementById("inquiry_name1").setAttribute("disabled", true);
        document.getElementById("inquiry_name2").setAttribute("disabled", true);
        document.getElementById("inquiry_email").setAttribute("disabled", true);
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
      let inquiry_message_elem = document.getElementById("inquiry_message");
      inquiry_message_elem.innerHTML = "Your inquiry has been submitted.";
      setTimeout(() => {
        contactUsModal.classList.remove("is-active");
        const inquiry_form = document.getElementById("contactForm");
        const inquiry_form_inputs = inquiry_form.getElementsByTagName("input");
        let inquiry_input_num = 0;
        while (inquiry_input_num < inquiry_form_inputs.length) {
          inquiry_form_inputs[inquiry_input_num].value = "";
          inquiry_input_num = inquiry_input_num + 1;
        }
        inquiry_message_elem.innerHTML = "";
      }, 3000);
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

const payNowModal = document.createElement("div");
payNowModal.classList.add("modal");
payNowModal.id = "pay_now_modal";
payNowModal.innerHTML = `
  <div class="modal-background"></div>
  <div class="modal-content has-text-centered">
    <div class="box">
      <h2 class="title is-4">Scan to Pay</h2>
      <h4 class="title is-6">Pay Amount due for your order through Venmo</h4>
       <p id="amount_due" class="mb-4 has-text-weight-semibold"></p>
      <img src="venmo.jpeg" alt="Venmo QR Code" style="max-width: 300px;" />
            <h4 class="title is-6">@Brettlachtman</h4>
    </div>
  </div>
  <button class="modal-close is-large" aria-label="close"></button>
`;
document.body.appendChild(payNowModal);

document
  .querySelector("#pay_now_modal .modal-close")
  .addEventListener("click", () => {
    document.getElementById("pay_now_modal").classList.remove("is-active");
  });
